import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Meja = () => {
  const [dataMeja, setDataMeja] = useState([]);
  const [filterStatus, setFilterStatus] = useState("available"); // Default: hanya meja tersedia
  const token = localStorage.getItem("token");

  // Fetch data dari API
  const tampilData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/meja", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
  
      // Filter data agar hanya menampilkan yang belum dihapus (deleted_at === null)
      const filteredData = data.filter((item) => item.deleted_at === null);
  
      setDataMeja(filteredData);
    } catch (error) {
      console.error("Gagal mengambil data meja:", error);
    }
  };
  

  useEffect(() => {
    tampilData();
  }, []);

  // Hapus meja
  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Yakin ingin menghapus meja ini?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/meja/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Gagal menghapus, status: ${response.status}`);
            }
            return response.json();
          })
          .then(() => {
            Swal.fire("Dihapus!", "Data meja berhasil dihapus.", "success");
            tampilData();
          })
          .catch((error) => {
            console.error("Gagal menghapus meja:", error);
            Swal.fire("Error!", "Gagal menghapus meja.", "error");
          });
      }
    });
  };

  const filteredMeja = dataMeja
    .filter((item) => !item.deleted_at)
    .filter((item) => {
      if (filterStatus === "available") return item.status === "tersedia";
      if (filterStatus === "booked") return item.status === "dibooking";
      if (filterStatus === "in_use") return item.status === "dipakai";
      return true;
    });

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select w-25"
                >
                  <option value="all">Tampilkan Semua</option>
                  <option value="available">Tampilkan Meja Tersedia</option>
                  <option value="booked">Tampilkan Meja Dibooking</option>
                  <option value="in_use">Tampilkan Meja Dipakai</option>
                </select>

                <Link
                  to="/admin/addmeja"
                  className="btn btn-primary"
                  style={{
                    borderRadius: "5px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    background: "blue",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Tambah Meja
                </Link>
              </div>

              <table className="table table-striped table-bordered mt-2">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Nomor Meja</th>
                    <th>Status</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeja.length > 0 ? (
                    filteredMeja.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.nomor_tempat}</td>
                        <td>{item.status}</td>
                        <td>
                          <Link
                            to={`/admin/editmeja/${item.idtempat}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(item.idtempat)}
                            className="btn btn-danger btn-sm"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Tidak ada data meja
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Meja;
