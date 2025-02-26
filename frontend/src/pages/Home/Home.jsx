import React, { useState } from "react";
import AddSewa from "../admin/Sewa/AddSewa";
import AddBooking from "../admin/Booking/AddBooking";

const HomeMember = () => {
  const [showAddSewa, setShowAddSewa] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [selectedPlaystation, setSelectedPlaystation] = useState(null);

  const handleSewa = (psId) => {
    setSelectedPlaystation(psId);
    setShowAddSewa(true);
    setShowAddBooking(false);
  };

  const handleBooking = (psId) => {
    setSelectedPlaystation(psId);
    setShowAddBooking(true);
    setShowAddSewa(false);
  };

  const handleCloseModal = () => {
    setShowAddSewa(false);
    setShowAddBooking(false);
    setSelectedPlaystation(null);
  };

  const playstations = [
    { id: 1, status: "fa-ban", waktu: "Selesai pukul 15:30", available: false },
    { id: 2, status: "fa-check", waktu: "", available: true },
    { id: 3, status: "fa-check", waktu: "", available: true },
    { id: 4, status: "fa-check", waktu: "", available: true },
    { id: 5, status: "fa-check", waktu: "", available: true },
    { id: 6, status: "fa-check", waktu: "", available: true },
    { id: 7, status: "fa-check", waktu: "", available: true },
    { id: 8, status: "fa-check", waktu: "", available: true },
    { id: "VIP", status: "fa-check", waktu: "", available: true },
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
        <div className="container">
          <a className="navbar-brand js-scroll-trigger" href="#page-top">
            Royal Rental
          </a>
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu <i className="fa fa-bars" />
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#availability">
                  Cek Ketersediaan
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link js-scroll-trigger" href="#order">
                  Pesan Playstation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Intro Header */}
      <header className="masthead">
        <div className="intro-body">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto home">
                <h1 className="brand-heading">Royal Rental</h1>
                <p className="intro-text">Tempat Rental PlayStation Terbaik</p>
                <a href="#availability" className="btn btn-circle js-scroll-trigger">
                  <i className="fa fa-angle-double-down animated" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cek Ketersediaan Playstation */}
      <section id="availability" className="content-section text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2>Cek Ketersediaan Playstation</h2>
              <div className="row">
                {playstations.map((ps) => (
                  <div className="col-sm-4 col-md-4" key={ps.id}>
                    <div className={`card mb-4 ${!ps.available ? 'bg-light' : ''}`}>
                      <span className={`fa fa-4x ${ps.status} mt-3`} />
                      <h6>{ps.waktu}</h6>
                      <div className="card-body">
                        <h5 className="card-title">Playstation {ps.id}</h5>
                        {ps.available && (
                          <div className="d-flex justify-content-around mt-3">
                            <button 
                              className="btn btn-primary btn-sm" 
                              onClick={() => handleSewa(ps.id)}
                            >
                              Sewa Langsung
                            </button>
                            <button 
                              className="btn btn-success btn-sm" 
                              onClick={() => handleBooking(ps.id)}
                            >
                              Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="content-section text-center bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2>Pesan Playstation</h2>
              <p>Pilih PlayStation dari daftar ketersediaan di atas untuk melakukan pemesanan.</p>
              <p>Anda dapat memilih antara Sewa Langsung atau Booking untuk waktu yang akan datang.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for AddSewa */}
      {showAddSewa && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sewa PlayStation {selectedPlaystation}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <AddSewa 
                  playstationId={selectedPlaystation} 
                  onClose={handleCloseModal} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for AddBooking */}
      {showAddBooking && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking PlayStation {selectedPlaystation}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <AddBooking 
                  playstationId={selectedPlaystation} 
                  onClose={handleCloseModal} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeMember;