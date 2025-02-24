import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditUnit = () => {
  const { idunit } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [unit, setUnit] = useState({
    jenis_ps: "",
    status: "",
    harga_per_jam: "",
  });

  useEffect(() => {
    getUnit();
  }, [idunit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUnit({ ...unit, [name]: value });
  };

  const getUnit = async () => {
    try {
      if (!token) {
        throw new Error("Akses ditolak! Silakan login terlebih dahulu.");
      }

      const response = await fetch(`http://localhost:3000/api/unit/${idunit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data unit (Status: ${response.status})`);
      }

      const data = await response.json();
      if (!data || !data.jenis_ps) {
        throw new Error("Unit tidak ditemukan!");
      }

      setUnit(data);
    } catch (error) {
      console.error("Error fetching unit:", error);
      Swal.fire({
        icon: "error",
        text: error.message,
      }).then(() => {
        navigate("/admin/unit");
      });
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/unit/${idunit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unit),
      });

      if (!response.ok) {
        throw new Error("Gagal mengupdate data unit");
      }

      Swal.fire({
        icon: "success",
        text: "Unit berhasil diperbarui!",
        timer: 1000,
      }).then(() => {
        navigate("/admin/unit");
      });
    } catch (error) {
      console.error("Error updating unit:", error);
      Swal.fire({
        icon: "error",
        text: "Gagal mengupdate data unit!",
      });
    }
  };

  return (
    <section className="content">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h2 className="text-center">Edit Unit PS</h2>

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Jenis PS</label>
                <select
                  className="form-control"
                  name="jenis_ps"
                  value={unit.jenis_ps || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Jenis PS --</option>
                  <option value="PlayStation 3">PS3</option>
                  <option value="PlayStation 4">PS4</option>
                  <option value="PlayStation 5">PS5</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={unit.status || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="tersedia">Tersedia</option>
                  <option value="disewa">Disewa</option>
                  <option value="dipakai">Dipakai</option>
                  <option value="perawatan">Perawatan</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Harga per Jam</label>
                <input
                  type="number"
                  className="form-control"
                  name="harga_per_jam"
                  value={unit.harga_per_jam || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Update Unit
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => navigate("/admin/unit")}
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

export default EditUnit;
