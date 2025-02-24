import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [totalSewa, setTotalSewa] = useState(0);
  const [totalBooking, setTotalBooking] = useState(0);
  const [totalMember, setTotalMember] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      // Ambil data sewa
      const responseSewa = await fetch("http://localhost:3000/api/sewa", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataSewa = await responseSewa.json();
      console.log("Data Sewa:", dataSewa);
      const activeSewa = dataSewa.filter((sewa) => sewa.deleted_at === null); // Filter hanya sewa aktif
      setTotalSewa(activeSewa.length);
  
      // Ambil data booking
      const responseBooking = await fetch("http://localhost:3000/api/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataBooking = await responseBooking.json();
      console.log("Data Booking:", dataBooking);
      const activeBooking = dataBooking.filter((booking) => booking.deleted_at === null);
      setTotalBooking(activeBooking.length);
  
      // Ambil semua data member (TIDAK difilter)
      const responseMember = await fetch("http://localhost:3000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataMember = await responseMember.json();
      console.log("Data Member:", dataMember);
      setTotalMember(dataMember.length); // Semua member ditampilkan
  
      // Ambil semua data unit PS (TIDAK difilter)
      const responseUnit = await fetch("http://localhost:3000/api/unit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataUnit = await responseUnit.json();
      console.log("Data Unit PS:", dataUnit);
      setTotalUnit(dataUnit.length); // Semua unit PS ditampilkan
  
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };  

  useEffect(() => {
    fetchData(); // Fetch pertama kali
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          {/* Total Sewa */}
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

          {/* Total Booking */}
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

          {/* Total Member */}
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

          {/* Total Unit PS */}
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
      </div>
    </section>
  );
};

export default Dashboard;
