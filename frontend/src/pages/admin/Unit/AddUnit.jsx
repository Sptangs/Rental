import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddUnit = () => {
  const [formData, setFormData] = useState({
    jenis_ps: "",
    harga_sewa: "",
    harga_per_jam: "",
    status: "tersedia",
    stok: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "stok" ? parseInt(value, 10) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Data yang dikirim:", formData);

    try {
      const response = await fetch("http://localhost:3000/api/unit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menambahkan unit PS");

      Swal.fire("Success", "Unit PS berhasil ditambahkan!", "success").then(() => {
        navigate("/admin/unit");
      });

    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col">
              <h1 className="m-0">Data Unit PS</h1>
            </div>
            <div className="col">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Input Unit PS</li>
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
                  <Link to="/admin/unit" className="btn btn-primary float-start">Lihat Data</Link>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="jenis_ps">Jenis PS</label>
                      <select
                        name="jenis_ps"
                        className="form-control"
                        value={formData.jenis_ps}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Pilih Jenis PS --</option>
                        <option value="PlayStation 3">PS3</option>
                        <option value="PlayStation 4">PS4</option>
                        <option value="PlayStation 5">PS5</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="harga_sewa">Harga Sewa</label>
                      <input
                        type="number"
                        name="harga_sewa"
                        className="form-control"
                        value={formData.harga_sewa}
                        onChange={handleChange}
                        required
                        placeholder="Harga sewa per sesi"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="harga_per_jam">Harga Per Jam</label>
                      <input
                        type="number"
                        name="harga_per_jam"
                        className="form-control"
                        value={formData.harga_per_jam}
                        onChange={handleChange}
                        required
                        placeholder="Harga sewa per jam"
                      />
                    </div>
                    <div className="form-group">
                      <label>Stok</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stok"
                        value={formData.stok}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan jumlah stok"
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
                        <option value="disewa">Disewa</option>
                        <option value="dipakai">Dipakai</option>
                        <option value="perawatan">Perawatan</option>
                      </select>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">Simpan</button>
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

export default AddUnit;
