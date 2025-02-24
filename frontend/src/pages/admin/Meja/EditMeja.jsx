import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditMeja = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nomor_meja, setNomorMeja] = useState("");
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getMeja();
    } else {
      navigate("/login");
    }
  }, [id, token]);

  const getMeja = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/meja/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data meja (Status: ${response.status})`);
      }

      const data = await response.json();
      if (!data || !data.nomor_meja) {
        throw new Error("Meja tidak ditemukan!");
      }

      setNomorMeja(data?.nomor_meja || "");
      setStatus(data?.status || "");
    } catch (error) {
      console.error("Error fetching meja:", error);
      Swal.fire({
        icon: "error",
        text: error.message,
      }).then(() => {
        navigate("/admin/meja");
      });
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedData = { nomor_meja, status };

    try {
      const response = await fetch(`http://localhost:3000/api/meja/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Gagal mengupdate data meja");
      }

      Swal.fire({
        icon: "success",
        text: "Update Berhasil!",
        timer: 1000,
        showConfirmButton: false
      }).then(() => {
        navigate("/admin/meja");
      });
    } catch (error) {
      console.error("Error updating meja:", error);
      Swal.fire({
        icon: "error",
        text: "Gagal mengupdate data meja!",
      });
    }
  };

  return (
    <section className="content">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h2 className="text-center">Edit Meja</h2>

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Nomor Meja</label>
                <input
                  type="text"
                  className="form-control"
                  value={nomor_meja}
                  onChange={(e) => setNomorMeja(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="tersedia">Tersedia</option>
                  <option value="dipesan">Dipesan</option>
                  <option value="digunakan">Digunakan</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">Update Meja</button>
              <button
                type="button"
                className="btn btn-secondary ml-2"
                onClick={() => navigate("/admin/meja")}
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditMeja;
