import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const BookingCard = () => {
  const [bookings, setBookings] = useState([]);
  const [members, setMembers] = useState({});
  const [places, setPlaces] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/booking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        
        const today = new Date().toLocaleDateString();
        const activeBookings = data.filter(
          (booking) =>
            booking.deleted_at === null &&
            new Date(booking.tanggal_booking).toLocaleDateString() === today
        );
        setBookings(activeBookings);
      } catch (error) {
        console.error("Gagal mengambil data booking:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/members", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        
        const membersMap = data.reduce((acc, member) => {
          acc[member.idmember] = member.nama;
          return acc;
        }, {});
        setMembers(membersMap);
      } catch (error) {
        console.error("Gagal mengambil data member:", error);
      }
    };

    const fetchPlaces = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/meja", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        
        const placesMap = data.reduce((acc, place) => {
          acc[place.idtempat] = place.nomor_tempat;
          return acc;
        }, {});
        setPlaces(placesMap);
      } catch (error) {
        console.error("Gagal mengambil data tempat:", error);
      }
    };

    fetchBookings();
    fetchMembers();
    fetchPlaces();

    const intervalFetch = setInterval(fetchBookings, 5000);
    return () => clearInterval(intervalFetch);
  }, [token]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());

      // Cek apakah ada booking yang sudah selesai
      bookings.forEach((booking) => {
        const selesaiTime = new Date(booking.tanggal_selesai);
        if (currentTime >= selesaiTime) {
          Swal.fire({
            title: "Waktu Booking Selesai",
            text: `Booking untuk tempat ${places[booking.idtempat]} sudah selesai.`,
            icon: "warning",
            confirmButtonText: "OK",
          });

          // Hapus booking dari daftar setelah alert muncul
          setBookings((prevBookings) =>
            prevBookings.filter((b) => b.id !== booking.id)
          );
        }
      });
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [bookings, currentTime, places]);

  return (
    <div>
      <h2 className="text-center my-3">Daftar Booking </h2>
      <h4 className="text-center mb-3">
        Waktu Sekarang: {currentTime.toLocaleTimeString()}
      </h4>

      <div className="row">
        {bookings.length === 0 ? (
          <p className="text-center">Tidak ada booking untuk hari ini.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="col-md-4 mb-3">
            <div className="card" style={{ textAlign: "justify" }}>
              <div className="card-body">
                <h5 className="card-title text-center">Booking #{booking.id}</h5>
                <p className="card-text">
                  <strong>Nama:</strong> {members[booking.idmember] || "Loading..."} <br />
                  <strong>Nomor Tempat:</strong> {places[booking.idtempat] || "Loading..."} <br />
                  <strong>Tanggal Booking:</strong> {new Date(booking.tanggal_booking).toLocaleDateString()} - {new Date(booking.tanggal_booking).toLocaleTimeString()} <br />
                  <strong>Tanggal Selesai:</strong> {new Date(booking.tanggal_selesai).toLocaleDateString()} - {new Date(booking.tanggal_selesai).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingCard;
