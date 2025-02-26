import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const ChartPendapatan = () => {
  const [chartData, setChartData] = useState([]);
  const [dataType, setDataType] = useState("sewa"); // State untuk switch antara sewa dan booking
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sewa", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sewaData = await response.json();

        const responseBooking = await fetch("http://localhost:3000/api/booking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingData = await responseBooking.json();

        // Pilih data berdasarkan tipe yang dipilih (sewa atau booking)
        const selectedData = dataType === "sewa" ? sewaData : bookingData;

        // Filter hanya data di tahun 2025 dan yang tidak memiliki deleted_at
        const validData = selectedData.filter(item => {
          const year = new Date(item.tanggal_sewa || item.tanggal_booking).getFullYear();
          return year === 2025 && !item.deleted_at;
        });

        // Kelompokkan pendapatan berdasarkan bulan
        const groupedData = validData.reduce((acc, item) => {
          const month = new Intl.DateTimeFormat("id-ID", {
            month: "short",
            year: "numeric",
          }).format(new Date(item.tanggal_sewa || item.tanggal_booking)); // Format: "Jan 2025"

          if (!acc[month]) {
            acc[month] = 0;
          }

          // Pastikan jumlah_pembayaran bertipe angka sebelum ditambahkan
          acc[month] += item.jumlah_pembayaran ? Number(item.jumlah_pembayaran) : 0;
          return acc;
        }, {});

        // Ubah objek menjadi array agar bisa ditampilkan di chart
        const formattedData = Object.keys(groupedData).map((month) => ({
          bulan: month,
          pendapatan: groupedData[month],
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, [dataType]); // useEffect akan berjalan saat dataType berubah

  // Fungsi untuk format ke Rupiah
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Tanpa koma desimal
    }).format(value);
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        Grafik Pendapatan per Bulan (2025)
        <button
          className={`btn btn-sm px-4 py-2 fw-bold transition ${
            dataType === "sewa"
              ? "btn-dark text-white" // Hitam solid saat "Sewa"
              : "btn-outline-dark text-white" // Abu-abu gelap outline saat "Booking"
          }`}
          onClick={() => setDataType(dataType === "sewa" ? "booking" : "sewa")}
        >
          {dataType === "sewa" ? "📅 Tampilkan Booking" : "🚗 Tampilkan Sewa"}
        </button>
      </div>
      <div className="card-body bg-secondary text-white">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#6c757d" /> {/* Grid dengan warna abu-abu */}
            <XAxis dataKey="bulan" stroke="#fff" /> {/* Label sumbu X putih */}
            <YAxis tickFormatter={formatRupiah} stroke="#fff" /> {/* Format Rupiah di sumbu Y */}
            <Tooltip formatter={(value) => formatRupiah(value)} cursor={{ fill: "#333" }} /> {/* Format Rupiah di Tooltip */}
            <Bar dataKey="pendapatan" fill={dataType === "sewa" ? "#8B0000" : "#1E3A8A"} /> {/* Warna Gelap */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartPendapatan;
