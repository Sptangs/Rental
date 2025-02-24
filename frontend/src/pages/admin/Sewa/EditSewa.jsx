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
    jumlah_hari: "",
    harga_sewa: "",
    denda: "",
    metode_pembayaran: "",
    jumlah_pembayaran: "",
    status_pembayaran: "",
    status: "",
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
      const filteredData = data.filter((member) => !member.deleted_at);
      setMembers(filteredData);
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
      const filteredData = data.filter(
        (unit) => !unit.deleted_at && unit.status === "tersedia"
      );
      setUnits(filteredData);
    } catch (error) {
      console.error("Gagal mengambil data unit PS:", error);
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
      console.log("Data sewa yang diterima:", data);
  
      setFormData({
        ...data,
        tanggal_sewa: data.tanggal_sewa ? data.tanggal_sewa.split("T")[0] : "",
        tanggal_kembali: data.tanggal_kembali
          ? data.tanggal_kembali.split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Gagal mengambil data penyewaan:", error);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    if ((name === "tanggal_booking" || name === "harga_sewa") && newFormData.tanggal_booking && newFormData.harga_sewa) {
      let startDate = new Date(newFormData.tanggal_booking);
      startDate.setDate(startDate.getDate() + parseInt(newFormData.harga_sewa, 10));
      newFormData.tanggal_selesai = formatDateToLocalIndonesia(startDate);
    }
    setFormData(newFormData);
  };
  const formatDateToLocalIndonesia = (date) => {
    const pad = (num) => num.toString().padStart(2, "0");
  
    const tahun = date.getFullYear();
    const bulan = pad(date.getMonth() + 1);
    const tanggal = pad(date.getDate());
    const jam = pad(date.getHours());
    const menit = pad(date.getMinutes());
  
    return `${tahun}-${bulan}-${tanggal}T${jam}:${menit}`;
  };

  const calculateTanggalKembali = (tanggal_sewa, jumlah_hari) => {
    if (!tanggal_sewa || isNaN(jumlah_hari) || jumlah_hari < 1) return "";

    const tanggalMulai = new Date(tanggal_sewa);
    tanggalMulai.setDate(tanggalMulai.getDate() + parseInt(jumlah_hari, 10));

    return tanggalMulai.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  const calculateJumlahPembayaran = (harga_sewa = 0, jumlah_hari = 1, denda = 0) => {
    return (parseInt(harga_sewa, 10) || 0) * (parseInt(jumlah_hari, 10) || 1) + (parseInt(denda, 10) || 0);
  };
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      // Jika unit dipilih, ambil harga_sewa dari unit yang sesuai
      if (name === "idunit") {
        const selectedUnit = units.find((unit) => unit.idunit.toString() === value.toString());
        updatedData.harga_sewa = selectedUnit ? selectedUnit.harga_sewa : 0;
      }
  
      // Perbarui jumlah pembayaran
      updatedData.jumlah_pembayaran = calculateJumlahPembayaran(
        updatedData.harga_sewa,
        updatedData.jumlah_hari,
        updatedData.denda
      );
  
      return updatedData;
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedFormData = { ...formData };
    delete cleanedFormData.deleted_at;

    console.log(
      "🔍 Data yang dikirim ke server (tanpa deleted_at):",
      cleanedFormData
    );

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

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
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
                    <select
                      name="idmember"
                      className="form-control"
                      value={formData.idmember}
                      onChange={handleChange}
                      required
                    >
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
  <select
    name="idunit"
    className="form-control"
    value={formData.idunit}
    onChange={handleChange}
    required
  >
    <option value="">Pilih Unit PS</option>
    {units.map((unit) => (
      <option key={unit.idunit} value={unit.idunit}>
        {unit.jenis_ps}
      </option>
    ))}
  </select>
</div>

<div className="form-group">
  <label>Harga Sewa</label>
  <input
    type="text"
    className="form-control"
    value={formatRupiah(formData.harga_sewa)}
    disabled
  />
</div>


                  <div className="form-group">
                    <label>Jumlah Hari</label>
                    <input
                      type="number"
                      name="jumlah_hari"
                      className="form-control"
                      value={formData.jumlah_hari}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tanggal Sewa</label>
                    <input
                      type="date"
                      name="tanggal_sewa"
                      className="form-control"
                      value={formData.tanggal_sewa}
                      onChange={handleDateChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tanggal Kembali</label>
                    <input
                      type="date"
                      name="tanggal_kembali"
                      className="form-control"
                      value={formData.tanggal_kembali}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Denda</label>
                  <input 
                      type="text" 
                      name="denda" 
                      className="form-control" 
                      value={formData.denda} 
                      onChange={handleChange} 
                    />

                  </div>
                  <div className="mb-3">
                      <label className="form-label">Jumlah Pembayaran</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formatRupiah(formData.jumlah_pembayaran)}
                        readOnly
                      />
                    </div>
                  <div className="form-group">
                    <label>Metode Pembayaran</label>
                    <select
                      name="metode_pembayaran"
                      className="form-control"
                      value={formData.metode_pembayaran}
                      onChange={handleChange}
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>


                  <div className="form-group">
                    <label>Status Penyewaan</label>
                    <select
                      name="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="berlangsung">Berlangsung</option>
                      <option value="selesai">Selesai</option>
                      <option value="dibatalkan">Dibatalkan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status Pembayaran</label>
                    <select
                      name="status_pembayaran"
                      className="form-control"
                      value={formData.status_pembayaran}
                      onChange={handleChange}
                      required
                    >
                      <option value="belum dibayar">Belum Lunas</option>
                      <option value="lunas">Lunas</option>
                      <option value="tertunda">Tertunda</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => navigate("/admin/sewa")}
                  >
                    Kembali
                  </button>
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

