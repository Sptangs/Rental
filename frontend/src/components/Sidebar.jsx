import React from 'react'
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidebar = () => {

  const Logout = () => {
    Swal.fire({
        title: 'Are you sure you want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("token");
            window.location.href = '/';
        }
    });
};

  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
  <div className="sidebar">
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="info">
        <a href="#" className="d-block">Gaming Pad Station</a>
      </div>
    </div>
    <nav className="mt-2">
  <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
    
    <li className="nav-item">
      <NavLink to="dashboard" className="nav-link">
        <i className="nav-icon fas fa-home" /> {/* Ikon Rumah untuk Dashboard */}
        <p>Dashboard</p>
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="user" className="nav-link">
        <i className="nav-icon fas fa-user-shield" /> {/* Ikon Shield untuk User (Admin) */}
        <p>User</p>
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="member" className="nav-link">
        <i className="nav-icon fas fa-users" /> {/* Ikon People untuk Member */}
        <p>Member</p>
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="unit" className="nav-link">
        <i className="nav-icon fas fa-gamepad" /> {/* Ikon Gamepad untuk Unit PS */}
        <p>Unit PS</p>
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="meja" className="nav-link">
        <i className="nav-icon fas fa-chair" /> {/* Ikon Kursi untuk Meja */}
        <p>Tempat PS</p>
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="sewa" className="nav-link">
        <i className="nav-icon fas fa-handshake" /> {/* Ikon Jabat Tangan untuk Sewa */}
        <p>Sewa</p>
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="booking" className="nav-link">
        <i className="nav-icon fas fa-calendar-check" /> {/* Ikon Kalender Checklist untuk Booking */}
        <p>Booking</p>
      </NavLink>
    </li>

    {/* Logout Menu */}
    <li className="nav-item">
      <NavLink onClickCapture={Logout} to="/logout" className="nav-link">
        <i className="nav-icon fas fa-sign-out-alt" /> {/* Ikon Logout */}
        <p>Logout</p>
      </NavLink>
    </li>

  </ul>
</nav>

    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

    </>
  )
}

export default Sidebar
