import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
      event.preventDefault();
      const fData = { email, password };

      const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          mode: "cors",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(fData),
      })
      .then(response => response.json())
      .then(data => {
          if (data.token != null) {
              localStorage.setItem('token', data.token);
              event.target.reset();
              window.location.href = '/admin/dashboard';
          } else {
              event.target.reset();
              Swal.fire({
                  icon: "error",
                  text: "User Tidak Ditemukan",
                  timer: 1000
              });
          }
      })
      .catch(error => {
          console.error('Error : ', error);
          Swal.fire({
              icon: "error",
              text: "Terjadi kesalahan saat login, coba lagi",
              timer: 1000
          });
      });
  };

  return (
    <>
      <div className="login-box">
        <div className="login-logo">
          <a href="#"><b>Admin</b>LTE</a>
        </div>
        {/* /.login-logo */}
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>
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
                {/* /.col */}
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                </div>
                {/* /.col */}
              </div>
            </form>
            <div className="social-auth-links text-center mb-3">
              <p>- OR -</p>
              <a href="#" className="btn btn-block btn-primary">
                <i className="fab fa-facebook mr-2" /> Sign in using Facebook
              </a>
              <a href="#" className="btn btn-block btn-danger">
                <i className="fab fa-google-plus mr-2" /> Sign in using Google+
              </a>
            </div>
            <p className="mb-1">
              <a href="#">I forgot my password</a>
            </p>
            <p className="mb-0">
              <a href="#" className="text-center">Register a new membership</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
