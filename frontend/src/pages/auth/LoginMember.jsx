import React, { useState } from 'react';
import Swal from 'sweetalert2';

const LogMember = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fData = { email, password };

    try {
      const response = await fetch("http://localhost:3000/api/login-member", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        Swal.fire({
          icon: "success",
          text: "Login berhasil!",
          timer: 1500,
          showConfirmButton: false
        });
        window.location.href = '/member/dashboard';
      } else {
        Swal.fire({
          icon: "error",
          text: data.message || "Login gagal, periksa kembali email dan password!",
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: "error",
        text: "Terjadi kesalahan saat login, coba lagi",
        timer: 1500
      });
    }
  };

  return (
    <>
      <div className="login-box">
        <div className="login-logo">
          <a href="#"><b>Member</b> Login</a>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Masuk untuk memulai sesi</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                    <span className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">
                      Remember Me
                    </label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                </div>
              </div>
            </form>
            <p className="mb-1">
              <a href="#">Lupa password?</a>
            </p>
            <p className="mb-0">
              <a href="#" className="text-center">Daftar sebagai member baru</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogMember;
