import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const UnitPS = () => {
  const [unitList, setUnitList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("semua"); // Default: Semua unit
  const [refresh, setRefresh] = useState(false); // State tambahan untuk re-fetch
  const token = localStorage.getItem("token");

  // Pastikan token ada sebelum fetch
  useEffect(() => {
    if (!token) {
      Swal.fire("Error!", "Token tidak ditemukan, silakan login ulang.", "error");
      return;
    }
    fetchData();
  }, [refresh]); // Fetch ulang saat refresh berubah

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const response = await fetch("http://localhost:3000/api/unit", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data dari API:", data); // Debugging
      setUnitList(data);
    } catch (error) {
      console.error("Gagal mengambil data unit PS:", error);
      Swal.fire("Error!", "Gagal mengambil data unit PS.", "error");
    }
  };

  const handleDelete = (idunit) => {
    console.log("Menghapus unit dengan ID:", idunit); // Debugging

    if (!idunit) {
      Swal.fire("Error!", "ID tidak valid!", "error");
      return;
    }

    Swal.fire({
      icon: "warning",
      title: "Yakin menghapus unit ini?",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/unit/${idunit}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
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
            Swal.fire("Terhapus!", "Unit PS berhasil dihapus.", "success");
            setRefresh((prev) => !prev); // Trigger re-fetch data
          })
          .catch((error) => {
            console.error("Error saat menghapus unit PS:", error);
            Swal.fire("Error!", "Gagal menghapus unit PS.", "error");
          });
      }
    });
  };

  // Format harga ke Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Filter berdasarkan status yang dipilih
  const filteredUnits = unitList.filter((unit) =>
    filterStatus === "semua" ? true : unit.status.toLowerCase() === filterStatus
  );

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Dropdown Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-control"
                  style={{ width: "200px" }}
                >
                  <option value="semua">Semua Unit</option>
                  <option value="tersedia">Tersedia</option>
                  <option value="dipakai">Dipakai</option>
                  <option value="perawatan">Perawatan</option>
                </select>

                <Link
                  to="/admin/addunit"
                  className="btn btn-primary"
                  style={{
                    borderRadius: "5px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    background: "blue",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "red";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "blue";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Tambah Unit PS
                </Link>
              </div>

              <table className="table table-striped table-bordered mt-2">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Jenis PS</th>
                    <th>Harga Sewa</th>
                    <th>Harga Per Jam</th>
                    <th>Status</th>
                    <th>Stok</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUnits.length > 0 ? (
                    filteredUnits.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.jenis_ps}</td>
                        <td>{formatRupiah(item.harga_sewa)}</td>
                        <td>{formatRupiah(item.harga_per_jam)}</td>
                        
                        <td>
                          <span
                            className={`badge ${
                              item.status === "tersedia"
                                ? "bg-success"
                                : item.status === "dipakai"
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>{item.stok}</td>
                        <td>
                          <Link
                            to={`/admin/editunit/${item.idunit}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(item.idunit)}
                            className="btn btn-danger btn-sm"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Tidak ada data unit PS
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

export default UnitPS;
