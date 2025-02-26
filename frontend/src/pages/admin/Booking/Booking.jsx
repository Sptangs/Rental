import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Booking = () => {
  const [dataBooking, setDataBooking] = useState([]);
  const [members, setMembers] = useState([]);
  const [tempat, setTempat] = useState([]);
  const [unitPS, setUnitPS] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // State untuk filter status
  const token = localStorage.getItem("token");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchBooking = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      // Filter data yang tidak memiliki deleted_at dan urutkan berdasarkan tanggal_booking terbaru
      setDataBooking(
        data
          .filter((item) => !item.deleted_at)
          .sort((a, b) => new Date(b.tanggal_booking) - new Date(a.tanggal_booking)) // Urutan Descending
      );
    } catch (error) {
      console.error("Gagal mengambil data booking:", error);
    }
  };
  

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(await response.json());
    } catch (error) {
      console.error("Gagal mengambil data members:", error);
    }
  };

  const fetchTempat = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/meja", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTempat(await response.json());
    } catch (error) {
      console.error("Gagal mengambil data tempat:", error);
    }
  };

  const fetchUnitPS = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnitPS(await response.json());
    } catch (error) {
      console.error("Gagal mengambil data unit PS:", error);
    }
  };

  useEffect(() => {
    fetchBooking();
    fetchMembers();
    fetchTempat();
    fetchUnitPS();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Yakin ingin menghapus data booking ini?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/booking/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Gagal menghapus, status: ${response.status}`);
            }
            return response.json();
          })
          .then(() => {
            Swal.fire("Dihapus!", "Data booking berhasil dihapus.", "success");
            fetchBooking();
          })
          .catch((error) => {
            console.error("Gagal menghapus booking:", error);
            Swal.fire("Error!", "Gagal menghapus booking.", "error");
          });
      }
    });
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  // Filter data berdasarkan status
  const filteredBooking = statusFilter
    ? dataBooking.filter((item) => item.status === statusFilter)
    : dataBooking;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooking.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooking.length / itemsPerPage);

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateStatusBooking = async (idbooking, newStatus) => {
    console.log("ID Booking:", idbooking);
  
    try {
      const response = await fetch(`http://localhost:3000/api/booking/${idbooking}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error(`Gagal update status booking, status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Berhasil update status booking:", result);
  
      Swal.fire({
        icon: "success",
        title: "Status Berhasil Diperbarui",
        text: `Booking ${idbooking} telah diubah menjadi ${newStatus}`,
        timer: 2000,
        showConfirmButton: false,
      });
  
      fetchBooking();
    } catch (error) {
      console.error("Gagal update status booking:", error);
  
      Swal.fire({
        icon: "error",
        title: "Gagal Memperbarui Status",
        text: "Terjadi kesalahan saat memperbarui status booking.",
      });
    }
  };
  
  const checkAndUpdateStatus = () => {
    const now = new Date();
  
    dataBooking.forEach((booking) => {
      const endTime = new Date(booking.tanggal_selesai);
  
      if (booking.status === "berlangsung" && endTime <= now) {
        updateStatusBooking(booking.idbooking, "selesai");
      }
    });
  };
  
  useEffect(() => {
    fetchBooking();
  
    const interval = setInterval(() => {
      checkAndUpdateStatus();
    }, 10000);
  
    return () => clearInterval(interval);
  }, [dataBooking]);    
  
  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Filter Status: </label>
            <select onChange={handleStatusChange} value={statusFilter} className="form-control">
              <option value="">Semua</option>
              <option value="tertunda">Tertunda</option>
              <option value="berlangsung">Berlangsung</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
          <div className="col-md-6 text-right" style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
            <Link
              to="/admin/addbooking"
              className="btn btn-primary"
              style={{ borderRadius: "5px", padding: "10px 20px", fontSize: "1rem" }}
            >
              Tambah Booking
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Nama Member</th>
                    <th>Nomor Tempat</th>
                    <th>Jenis PS</th>
                    <th>Tgl Booking</th>
                    <th>Tgl Selesai</th>
                    <th>Jumlah Jam</th>
                    <th>Harga</th>
                    <th>Pembayaran</th>
                    <th>Jumlah Pembayaran</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => {
                      const member = members.find((m) => m.idmember === item.idmember);
                      const namaMember = member ? member.nama : "Tidak ditemukan";

                      const tempatItem = tempat.find((t) => t.idtempat === item.idtempat);
                      const nomorTempat = tempatItem ? tempatItem.nomor_tempat : "Tidak ditemukan";

                      const unitItem = unitPS.find((u) => u.idunit === item.idunit);
                      const jenisPS = unitItem ? unitItem.jenis_ps : "Tidak ditemukan";

                      return (
                        <tr key={index}>
                          <td>{indexOfFirstItem + index + 1}</td>
                          <td>{namaMember}</td>
                          <td>{nomorTempat}</td>
                          <td>{jenisPS}</td>
                          <td>{new Intl.DateTimeFormat("id-ID", { 
                              day: "2-digit", month: "short", year: "numeric", 
                              hour: "2-digit", minute: "2-digit", hour12: false 
                            }).format(new Date(item.tanggal_booking))}</td>

                          <td>{new Intl.DateTimeFormat("id-ID", { 
                              day: "2-digit", month: "short", year: "numeric", 
                              hour: "2-digit", minute: "2-digit", hour12: false 
                            }).format(new Date(item.tanggal_selesai))}</td>
                          <td>{item.jumlah_jam} jam</td>
                          <td>{formatRupiah(item.harga_booking)}</td>
                          <td>{item.metode_pembayaran} ({item.status_pembayaran})</td>
                          <td>{formatRupiah(item.jumlah_pembayaran)}</td>
                          <td>{item.status}</td>
                          <td>
                              <select
                                className="form-control"
                                value={item.status}
                                onChange={(e) => {
                                  Swal.fire({
                                    title: "Ubah Status Booking?",
                                    text: `Apakah Anda yakin ingin mengubah status booking ini menjadi "${e.target.value}"?`,
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: "Ya, Ubah!",
                                    cancelButtonText: "Batal",
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      updateStatusBooking(item.idbooking, e.target.value);
                                    }
                                  });
                                }}
                              >
                                <option value="tertunda">Tertunda</option>
                                <option value="berlangsung">Berlangsung</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                              </select>
                            </td>

                          <td>
                            <Link to={`/admin/editbooking/${item.idbooking}`} className="btn btn-warning btn-sm">
                              <i className="fas fa-edit"></i>
                            </Link>
                          </td>
                          <td>
                            <button onClick={() => handleDelete(item.idbooking)} className="btn btn-danger btn-sm">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="14" className="text-center">
                        Tidak ada data booking
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredBooking.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span>Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredBooking.length)} dari {filteredBooking.length} data</span>
                </div>
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                      >
                        &laquo;
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        &lt;
                      </button>
                    </li>
                    
                    {/* Generate page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum;
                      
                      if (totalPages <= 5) {
                        // If 5 or fewer pages, show all
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // If at start, show first 5
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // If at end, show last 5
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Show 2 before, current, 2 after
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <li 
                          className={`page-item ${currentPage === pageNum ? 'active' : ''}`} 
                          key={pageNum}
                        >
                          <button 
                            className="page-link" 
                            onClick={() => paginate(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        &gt;
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;