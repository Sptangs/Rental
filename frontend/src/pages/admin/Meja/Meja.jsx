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

    const updateStatusMeja = async (idtempat, newStatus) => {
      try {
          const response = await fetch(`http://localhost:3000/api/meja/${idtempat}/status`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`, // Jika menggunakan autentikasi
              },
              body: JSON.stringify({ status: newStatus })
          });
  
          if (!response.ok) {
              throw new Error(`Gagal update status meja, status: ${response.status}`);
          }
  
          const result = await response.json();
          console.log("Berhasil update status meja:", result);
          tampilData(); // Refresh data di tabel setelah update
      } catch (error) {
          console.error("Gagal update status meja:", error);
      }
  };
  

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
                  className="form-control w-25"
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

              <table className="table table-striped table-bordered mt-2 text-center">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Nomor Meja</th>
                    <th>Status</th>
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
                          <select
                            className="form-control"
                            value={item.status}
                            onChange={(e) => updateStatusMeja(item.idtempat, e.target.value)}
                          >
                            <option value="tersedia">Tersedia</option>
                            <option value="dipakai">Dipakai</option>
                            <option value="dibooking">Dibooking</option>
                          </select>
                        </td>
                        <td>
                          <Link
                            to={`/admin/editmeja/${item.idtempat}`}
                            className="btn btn-warning btn-sm"
                          >
                          <i className="	fas fa-edit"></i> Edit
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(item.idtempat)}
                            className="btn btn-danger btn-sm"
                          >
                          <i className="	fas fa-trash"></i>Hapus
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
