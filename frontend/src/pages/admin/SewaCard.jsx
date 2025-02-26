import React, { useEffect, useState } from "react";
import moment from "moment";
import "../css/Sewacard.css";

const SewaCard = () => {
  const [dataSewa, setDataSewa] = useState([]);
  const [currentTime, setCurrentTime] = useState(moment().format("DD MMM YYYY HH:mm"));
  const token = localStorage.getItem("token");

  const fetchSewa = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sewa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      // Ambil hanya penyewaan dalam satu minggu terakhir
      const oneWeekAgo = moment().subtract(7, "days").startOf("day");
      const today = moment().endOf("day");
      const filteredData = data.filter((item) =>
        moment(item.tanggal_sewa).isBetween(oneWeekAgo, today, null, "[]") && !item.deleted_at
      );

      setDataSewa(filteredData);
    } catch (error) {
      console.error("Gagal mengambil data penyewaan:", error);
    }
  };

  useEffect(() => {
    fetchSewa();
    
    // Update waktu setiap menit
    const interval = setInterval(() => {
      setCurrentTime(moment().format("DD MMM YYYY HH:mm"));
    }, 60000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return (
    <div className="container">
      <h2 className="text-center my-3">Daftar Penyewaan Minggu Ini</h2>
      <p className="text-center text-muted">Waktu sekarang: {currentTime}</p>

      <div className="row">
        {dataSewa.length > 0 ? (
          dataSewa.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{item.nama_member}</h5>
                  <p className="card-text">
                    <strong>Jenis PS:</strong> {item.jenis_ps} <br />
                    <strong>Tanggal Sewa:</strong> {moment(item.tanggal_sewa).format("DD MMM YYYY")} <br />
                    <strong>Tanggal Kembali:</strong> {moment(item.tanggal_kembali).format("DD MMM YYYY")} <br />
                    <strong>Status:</strong> <span className={`badge ${item.status === "Aktif" ? "bg-success" : "bg-danger"}`}>{item.status}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Tidak ada penyewaan dalam satu minggu terakhir.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SewaCard;
