import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import moment from "moment";

const Sewa = () => {
  const [dataSewa, setDataSewa] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const token = localStorage.getItem("token");

  const fetchSewa = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sewa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data.filter((item) => !item.deleted_at); // Hanya data yang belum dihapus
    } catch (error) {
      console.error("Gagal mengambil data penyewaan:", error);
      return [];
    }
  };
  

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error("Gagal mengambil data member:", error);
      return [];
    }
  };
  
  const fetchUnitPS = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.error("Gagal mengambil data unit PS:", error);
      return [];
    }
  };
  

  const tampilData = async () => {
    const sewaData = await fetchSewa();
    const membersData = await fetchMembers();
    const unitPSData = await fetchUnitPS();
  
    // Buat mapping untuk data member
    const memberMap = {};
    membersData.forEach((member) => {
      memberMap[member.idmember] = member.nama;
    });
  
    // Buat mapping untuk data unit PS
    const unitMap = {};
    unitPSData.forEach((unit) => {
      unitMap[unit.idunit] = unit.jenis_ps;
    });
  
    // Ambil tanggal hari ini
    const today = moment().startOf("day"); 
    
    const mergedData = sewaData.map((item) => {
      const tanggalSewa = moment(item.tanggal_sewa).startOf("day");
      const tanggalKembali = moment(item.tanggal_kembali).startOf("day");
  
      let statusTempat = item.status; // Status awal dari database
  
      // Jika tanggal sewa sudah tiba dan belum melebihi tanggal kembali, ubah status ke "Dipakai"
      if (tanggalSewa.isSameOrBefore(today) && tanggalKembali.isSameOrAfter(today)) {
        statusTempat = "Dipakai";
      }
  
      return {
        ...item,
        nama_member: memberMap[item.idmember] || "Tidak Diketahui",
        jenis_ps: unitMap[item.idunit] || "Tidak Diketahui",
        status: statusTempat, // Update status otomatis
      };
    });
  
    // Filter berdasarkan status jika ada filter yang diterapkan
    const filteredData = mergedData.filter(
      (item) => filterStatus === "" || item.status === filterStatus
    );
  
    setDataSewa(filteredData);
  };
  
  

  useEffect(() => {
    tampilData();
  }, [filterStatus]);

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Yakin ingin menghapus data penyewaan ini?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/sewa/${id}`, {
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
            Swal.fire("Dihapus!", "Data penyewaan berhasil dihapus.", "success");
            tampilData();
          })
          .catch((error) => {
            console.error("Gagal menghapus penyewaan:", error);
            Swal.fire("Error!", "Gagal menghapus penyewaan.", "error");
          });
      }
    });
  };

  const handleUpdateStatus = async (idsewa, newStatus) => {
    Swal.fire({
        title: "Update Status",
        text: `Yakin ingin mengubah status menjadi "${newStatus}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Batal",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/sewa/${idsewa}/status`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Jika menggunakan autentikasi
                    },
                    body: JSON.stringify({ status: newStatus }),
                });

                if (!response.ok) {
                    throw new Error(`Gagal update status, status: ${response.status}`);
                }

                Swal.fire("Berhasil!", "Status penyewaan diperbarui.", "success");
                tampilData(); // Refresh data setelah update
            } catch (error) {
                console.error("Gagal update status:", error);
                Swal.fire("Error!", "Gagal memperbarui status.", "error");
            }
        }
    });
};

  // Fungsi untuk format ke Rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                to="/admin/addsewa"
                className="btn btn-primary"
                style={{ borderRadius: "5px", padding: "10px 20px", fontSize: "1rem" }}
              >
                Tambah Sewa
              </Link>
            </div>

            <div className="form-group mt-2">
              <label>Filter Status</label>
              <select
                className="form-control"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>

            <table className="table table-striped table-bordered mt-2 text-center">
              <thead className="table-light">
                <tr>
                  <th>No</th>
                  <th>Member</th>
                  <th>Jenis PS</th>
                  <th>Jumlah Hari</th>
                  <th>Tgl Sewa</th>
                  <th>Tgl Kembali</th>
                  <th>Harga</th>
                  <th>Denda</th>
                  <th>Pembayaran</th>
                  <th>Jumlah Pembayaran</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th>Edit</th>
                  <th>Hapus</th>
                </tr>
              </thead>
              <tbody>
  {dataSewa.length > 0 ? (
    dataSewa.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.nama_member}</td>
        <td>{item.jenis_ps}</td>
        <td>{item.jumlah_hari} hari</td>
        <td>{moment(item.tanggal_sewa).format("DD MMM YYYY")}</td>
        <td>{moment(item.tanggal_kembali).format("DD MMM YYYY")}</td>
        <td>{formatRupiah(item.harga_sewa)}</td>
        <td>{formatRupiah(item.denda)}</td>
        <td>{item.metode_pembayaran} ({item.status_pembayaran})</td>
        <td>{formatRupiah(item.jumlah_pembayaran)}</td>
        <td>{item.status}</td>
        <td>
            <select
              className="form-control"
              value={item.status}
              onChange={(e) => handleUpdateStatus(item.idsewa, e.target.value)}
            >
              <option value="tertunda">tertunda</option>
              <option value="berlangsung">berlangsung</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </td>
        <td>
          <Link to={`/admin/editsewa/${item.idsewa}`} className="btn btn-warning btn-sm">
            <i className="fas fa-edit"></i>
          </Link>
        </td>
        <td>
          <button onClick={() => handleDelete(item.idsewa)} className="btn btn-danger btn-sm">
            <i className="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="13" className="text-center">
        Tidak ada data penyewaan
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sewa;