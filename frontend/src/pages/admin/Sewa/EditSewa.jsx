import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditSewa = () => {
  const { idsewa } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    idmember: "",
    idunit: "",
    tanggal_sewa: "",
    tanggal_kembali: "",
    jumlah_hari: 1,
    harga_sewa: 0,
    denda: 0,
    metode_pembayaran: "cash",
    jumlah_pembayaran: 0,
    status_pembayaran: "belum lunas",
    status: "berlangsung",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMembers();
    fetchUnits();
    fetchSewaById();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Gagal mengambil data member:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error("Gagal mengambil data unit:", error);
    }
  };

  const fetchSewaById = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/sewa/${idsewa}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error("Gagal mengambil data sewa");
      }
  
      const data = await response.json();
      setFormData({
        ...data,
        tanggal_sewa: data.tanggal_sewa ? data.tanggal_sewa.split("T")[0] : "",
        tanggal_kembali: data.tanggal_kembali ? data.tanggal_kembali.split("T")[0] : "",
      });
    } catch (error) {
      console.error("Gagal mengambil data penyewaan:", error);
    }
  };
  

  const calculateTanggalKembali = (tanggal_sewa, jumlah_hari) => {
    if (!tanggal_sewa || !jumlah_hari) return "";
    const tanggalMulai = new Date(tanggal_sewa);
    tanggalMulai.setDate(tanggalMulai.getDate() + parseInt(jumlah_hari, 10));
    return tanggalMulai.toISOString().split("T")[0];
  };

  const calculateJumlahPembayaran = (harga_sewa = 0, jumlah_hari = 1, denda = 0) => {
    return (parseInt(harga_sewa, 10) || 0) * (parseInt(jumlah_hari, 10) || 1) + (parseInt(denda, 10) || 0);
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    console.log(`Nama field: ${name}, Nilai: ${value}`);

    if (name === "idunit") {
        const selectedUnit = units.find((unit) => unit.idunit == value);
        const newHargaPerJam = selectedUnit ? selectedUnit.harga_per_jam : 0;
      
        setFormData((prevData) => ({
          ...prevData,
          idunit: value,
          harga_per_jam: newHargaPerJam,
          harga_booking: calculateTotalHarga(newHargaPerJam, prevData.jumlah_jam),
        }));
    } 
    else if (["jumlah_jam", "tanggal_booking", "metode_pembayaran", "status"].includes(name)) {
        let newValue = value;

        // Pastikan jumlah jam minimal 1
        if (name === "jumlah_jam") {
            if (isNaN(value) || value === "" || value.includes("-")) {
                console.warn("Input jumlah_jam tidak valid, diubah ke 1");
                newValue = 1;
            } else {
                newValue = Math.max(1, parseInt(value, 10) || 1);
            }
        }

        console.log(`Setelah parsing - jumlah_jam: ${newValue}`);

        const updatedData = {
            ...formData,
            [name]: newValue,
        };

        // Update harga booking jika jumlah jam berubah
        updatedData.harga_booking = calculateTotalHarga(
            formData.harga_per_jam,
            updatedData.jumlah_jam
        );

        console.log("Data setelah update:", updatedData);

        setFormData(updatedData);
    } 
    else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
};

// Fungsi untuk menghitung total harga booking
const calculateTotalHarga = (hargaPerJam, jumlahJam) => {
    return hargaPerJam * (jumlahJam || 1);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const cleanedFormData = { ...formData };
    delete cleanedFormData.deleted_at; // Hapus jika tidak diperlukan
  
    console.log("🔍 Data yang dikirim ke server (tanpa deleted_at):", cleanedFormData);
  
    try {
      const response = await fetch(`http://localhost:3000/api/sewa/${idsewa}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedFormData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Swal.fire("Berhasil!", "Data penyewaan berhasil diperbarui", "success");
        navigate("/admin/sewa");
      } else {
        console.error("⚠️ Gagal memperbarui data:", result);
        Swal.fire("Gagal!", result.error || "Terjadi kesalahan", "error");
      }
    } catch (error) {
      console.error("❌ Error saat mengupdate data sewa:", error);
      Swal.fire("Error", "Terjadi kesalahan saat mengupdate data", "error");
    }
  };
  
  

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Edit Sewa</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Member</label>
                    <select name="idmember" className="form-control" value={formData.idmember} onChange={handleChange} required>
                      <option value="">Pilih Member</option>
                      {members.map((member) => (
                        <option key={member.idmember} value={member.idmember}>
                          {member.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Unit PS</label>
                    <select name="idunit" className="form-control" value={formData.idunit} onChange={handleChange} required>
                      <option value="">Pilih Unit PS</option>
                      {units.map((unit) => (
                        <option key={unit.idunit} value={unit.idunit}>
                          {unit.jenis_ps} - Rp {unit.harga_sewa}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Jumlah Hari</label>
                    <input type="number" name="jumlah_hari" className="form-control" value={formData.jumlah_hari} onChange={handleChange} min="1" required />
                  </div>

                  <div className="form-group">
                    <label>Tanggal Sewa</label>
                    <input type="date" name="tanggal_sewa" className="form-control" value={formData.tanggal_sewa} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Tanggal Kembali</label>
                    <input type="date" name="tanggal_kembali" className="form-control" value={formData.tanggal_kembali} readOnly />
                  </div>

                  <div className="form-group">
                    <label>Denda</label>
                    <input type="number" name="denda" className="form-control" value={formData.denda} onChange={handleChange} min="0" required />
                  </div>

                  <div className="form-group">
                    <label>Jumlah Pembayaran</label>
                    <input type="number" className="form-control" value={formData.jumlah_pembayaran} readOnly />
                  </div>

                  <div className="form-group">
  <label>Status Penyewaan</label>
  <select name="status" className="form-control" value={formData.status} onChange={handleChange} required>
    <option value="berlangsung">Berlangsung</option>
    <option value="selesai">Selesai</option>
    <option value="dibatalkan">Dibatalkan</option>
  </select>
</div>

<div className="form-group">
  <label>Status Pembayaran</label>
  <select name="status_pembayaran" className="form-control" value={formData.status_pembayaran} onChange={handleChange} required>
    <option value="belum lunas">Belum Lunas</option>
    <option value="lunas">Lunas</option>
  </select>
</div>


                  <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                  <button type="button" className="btn btn-secondary ml-2" onClick={() => navigate("/admin/sewa")}>Kembali</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditSewa;
