import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddSewa = () => {
  const [members, setMembers] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    idmember: "",
    idunit: "",
    jumlah_hari: 1,
    tanggal_sewa: "",
    tanggal_kembali: "",
    metode_pembayaran: "cash",
    status: "berjalan",
    jumlah_bayar: 0,
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
    fetchUnits();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Data Unit PS:", data);

      const availableUnits = data.filter((unit) => unit.status === "tersedia");
      setUnits(availableUnits);
    } catch (error) {
      console.error("Gagal mengambil data unit PS:", error);
    }
  };

  const calculateTanggalKembali = (tanggalSewa, jumlahHari) => {
    if (!tanggalSewa || !jumlahHari) return "";
    const sewaDate = new Date(tanggalSewa);
    sewaDate.setDate(sewaDate.getDate() + parseInt(jumlahHari));
    return sewaDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "idunit") {
      const selectedUnit = units.find(
        (unit) => unit.idunit === parseInt(value)
      );
  
      setFormData((prevData) => ({
        ...prevData,
        idunit: value,
        harga_sewa: selectedUnit ? selectedUnit.harga_sewa : "",
        jumlah_pembayaran:
          selectedUnit && prevData.jumlah_hari
            ? selectedUnit.harga_sewa * prevData.jumlah_hari
            : "",
      }));
    } else if (name === "jumlah_hari" || name === "tanggal_sewa") {
      setFormData((prevData) => {
        const updatedData = {
          ...prevData,
          [name]: value,
        };
  
        // ✅ Hitung tanggal kembali
        if (updatedData.tanggal_sewa && updatedData.jumlah_hari) {
          const sewaDate = new Date(updatedData.tanggal_sewa);
          sewaDate.setDate(sewaDate.getDate() + parseInt(updatedData.jumlah_hari));
          updatedData.tanggal_kembali = sewaDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
        }
  
        // ✅ Hitung ulang jumlah pembayaran
        updatedData.jumlah_pembayaran = prevData.harga_sewa
          ? prevData.harga_sewa * updatedData.jumlah_hari
          : "";
  
        return updatedData;
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData };
  
    if (formData.tanggal_sewa && formData.jumlah_hari) {
      const sewaDate = new Date(formData.tanggal_sewa);
      sewaDate.setDate(sewaDate.getDate() + parseInt(formData.jumlah_hari));
      updatedFormData.tanggal_kembali = sewaDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/sewa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambahkan penyewaan.");
      }
  
      Swal.fire("Berhasil!", "Penyewaan berhasil ditambahkan.", "success");
      navigate("/admin/sewa");
    } catch (error) {
      console.error("Gagal menambahkan penyewaan:", error);
      Swal.fire("Error!", "Gagal menambahkan penyewaan.", "error");
    }
  };
  

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Tambah Sewa</h3>
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

                  <select
                    name="idunit"
                    className="form-control"
                    value={formData.idunit}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Unit PS</option>
                    {units.map((unit) => (
                      <option key={unit.idunit} value={unit.idunit}>
                        {`PS ${unit.idunit} - Rp ${unit.harga_sewa}`}{" "}
                      </option>
                    ))}
                  </select>

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
                      onChange={handleChange}
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
                    <label>Status Pembayaran</label>
                    <select
                      name="status_pembayaran"
                      className="form-control"
                      value={formData.status_pembayaran}
                      onChange={handleChange}
                      required
                    >
                      <option value="dibayar">Dibayar</option>
                      <option value="belum dibayar">Belum Dibayar</option>
                      <option value="tertunda">Tertunda</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Total Harga</label>
                    <input
                      type="text"
                      name="jumlah_pembayaran"
                      className="form-control"
                      value={
                        formData.jumlah_pembayaran
                          ? `Rp ${formData.jumlah_pembayaran}`
                          : ""
                      }
                      readOnly
                    />
                  </div>

                  <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary">
                      Simpan
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={() => navigate("/admin/sewa")}
                    >
                      Kembali
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddSewa;
