import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";

const AddMeja = () => {
  const [formData, setFormData] = useState({
    nomor_tempat: "",
    status: "tersedia", // Default status
  });

  const navigate = useNavigate(); // Inisialisasi navigate
  const token = localStorage.getItem("token");

  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submit dengan konfirmasi swal
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Konfirmasi sebelum menyimpan
    const confirmResult = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data meja akan ditambahkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const response = await fetch("http://localhost:3000/api/meja", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menambahkan meja");

      // SweetAlert sukses
      Swal.fire({
        icon: "success",
        text: "TAMBAH Berhasil!",
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/admin/meja"); // Navigasi setelah sukses
      });

      // Reset form setelah berhasil
      setFormData({
        nomor_tempat: "",
        status: "tersedia",
      });
    } catch (error) {
      console.error("Error Add meja:", error);
      Swal.fire({
        icon: "error",
        text: "Gagal menambahkan data meja!",
      });
    }
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col">
              <h1 className="m-0">Data Meja</h1>
            </div>
            <div className="col">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Input Meja</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <Link to="/admin/meja" className="btn btn-primary float-start">
                    Lihat Data
                  </Link>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="nomor_tempat">Nomor Meja</label>
                      <input
                        type="text"
                        name="nomor_tempat"
                        className="form-control"
                        value={formData.nomor_tempat}
                        onChange={handleChange}
                        required
                        placeholder="Nomor meja (misal: M1, M2, ...)"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="status">Status</label>
                      <select
                        name="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="tersedia">Tersedia</option>
                        <option value="dipakai">Dipakai</option>
                        <option value="dibooking">DiBooking</option>
                      </select>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddMeja;
