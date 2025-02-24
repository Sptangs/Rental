import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Booking = () => {
  const [dataBooking, setDataBooking] = useState([]);
  const [members, setMembers] = useState([]);
  const [tempat, setTempat] = useState([]);
  const [unitPS, setUnitPS] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch data booking
  const fetchBooking = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDataBooking(data.filter((item) => !item.deleted_at));
    } catch (error) {
      console.error("Gagal mengambil data booking:", error);
    }
  };

  // Fetch data members
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

  // Fetch data tempat
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

  // Fetch data unit PS
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

  // Hapus booking
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

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  to="/admin/addbooking"
                  className="btn btn-primary"
                  style={{ borderRadius: "5px", padding: "10px 20px", fontSize: "1rem" }}
                >
                  Tambah Booking
                </Link>
              </div>
              <table className="table table-striped table-bordered mt-2">
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
                    <th>Status</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  {dataBooking.length > 0 ? (
                    dataBooking.map((item, index) => {
                      // Cari nama member berdasarkan idmember
                      const member = members.find((m) => m.idmember === item.idmember);
                      const namaMember = member ? member.nama : "Tidak ditemukan";

                      // Cari nomor tempat berdasarkan idtempat
                      const tempatItem = tempat.find((t) => t.idtempat === item.idtempat);
                      const nomorTempat = tempatItem ? tempatItem.nomor_tempat : "Tidak ditemukan";

                      const unitItem = unitPS.find((u) => u.idunit === item.idunit);
                      const jenisPS = unitItem ? unitItem.jenis_ps : "Tidak ditemukan";

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{namaMember}</td>
                          <td>{nomorTempat}</td>
                          <td>{jenisPS}</td>
                          <td>{new Date(item.tanggal_booking).toLocaleString("id-ID", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                          <td>{new Date(item.tanggal_selesai).toLocaleString("id-ID", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                          <td>{item.jumlah_jam} jam</td>
                          <td>Rp {item.harga_booking}</td>
                          <td>{item.metode_pembayaran} ({item.status_pembayaran})</td>
                          <td>{item.status}</td>
                          <td>
                            <Link to={`/admin/editbooking/${item.idbooking}`} className="btn btn-warning btn-sm">
                              Edit
                            </Link>
                          </td>
                          <td>
                            <button onClick={() => handleDelete(item.idbooking)} className="btn btn-danger btn-sm">
                              Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center">
                        Tidak ada data booking
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

export default Booking;
