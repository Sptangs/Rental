import React, { useState, useEffect } from "react";
import SewaCard from "./SewaCard";
import BookingCard from "./BookingCard";
import ChartPendapatan from "./chartsewa";


const Dashboard = () => {
  const [totalSewa, setTotalSewa] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);
  const [totalMember, setTotalMember] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const responseSewa = await fetch("http://localhost:3000/api/sewa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataSewa = await responseSewa.json();
      setTotalSewa(dataSewa.filter((sewa) => sewa.deleted_at === null).length);

      const responseBooking = await fetch("http://localhost:3000/api/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataBooking = await responseBooking.json();
      setTotalBooking(dataBooking.filter((booking) => booking.deleted_at === null).length);

      const responseMember = await fetch("http://localhost:3000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataMember = await responseMember.json();
      setTotalMember(dataMember.length);

      const responseUnit = await fetch("http://localhost:3000/api/unit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataUnit = await responseUnit.json();
      setTotalUnit(dataUnit.length);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-6">
            <div className="small-box bg-info">
              <div className="inner">
                <h3>{totalSewa}</h3>
                <p>Total Sewa</p>
              </div>
              <div className="icon">
                <i className="fas fa-gamepad"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-6">
            <div className="small-box bg-success">
              <div className="inner">
                <h3>{totalBooking}</h3>
                <p>Total Booking</p>
              </div>
              <div className="icon">
                <i className="fas fa-calendar-check"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-6">
            <div className="small-box bg-warning">
              <div className="inner">
                <h3>{totalMember}</h3>
                <p>Total Member</p>
              </div>
              <div className="icon">
                <i className="fas fa-users"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-6">
            <div className="small-box bg-danger">
              <div className="inner">
                <h3>{totalUnit}</h3>
                <p>Unit PS Tersedia</p>
              </div>
              <div className="icon">
                <i className="fas fa-tv"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Sewa */}
        <div className="mt-4">
          <SewaCard />
        </div>

        {/* Daftar Booking */}
        <div className="mt-4 text-center  ">
          <BookingCard />
        </div>

          <div className="container mt-4">
        <h3 className="text-center">Dashboard Pendapatan</h3>
        <ChartPendapatan />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
