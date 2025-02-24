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
      return data.filter((item) => !item.deleted_at);
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

    const memberMap = {};
    membersData.forEach((member) => {
      memberMap[member.idmember] = member.nama;
    });

    const unitMap = {};
    unitPSData.forEach((unit) => {
      unitMap[unit.idunit] = unit.jenis_ps;
    });

    const mergedData = sewaData.map((item) => ({
      ...item,
      nama_member: memberMap[item.idmember] || "Tidak Diketahui",
      jenis_ps: unitMap[item.idunit] || "Tidak Diketahui",
    }));

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

            <table className="table table-striped table-bordered mt-2">
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
                        <Link to={`/admin/editsewa/${item.idsewa}`} className="btn btn-warning btn-sm">
                          Edit
                        </Link>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(item.idsewa)} className="btn btn-danger btn-sm">
                          Hapus
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
