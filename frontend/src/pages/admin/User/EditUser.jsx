import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      Swal.fire("Error!", "Anda harus login!", "error");
      navigate("/login");
      return;
    }
    
    if (!id) {
      Swal.fire("Error!", "ID User tidak ditemukan!", "error");
      navigate("/admin/user");
      return;
    }

    getUser();
  }, [id]);

  const getUser = async () => {
    if (!id) return; 
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data user: ${response.statusText}`);
      }

      const data = await response.json();
      setNama(data.nama);
      setEmail(data.email);
      setRole(data.role);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error!", "Gagal mengambil data user.", "error");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!id) {
      Swal.fire("Error!", "ID User tidak valid!", "error");
      return;
    }

    const fData = { nama, email, role };
    if (password.trim() !== "") {
      fData.password = password;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fData),
      });

      if (!response.ok) {
        throw new Error(`Gagal mengupdate, status: ${response.status}`);
      }

      Swal.fire({ icon: "success", text: "Update Berhasil!", timer: 1500 }).then(() => {
        navigate("/admin/user");
      });
    } catch (error) {
      console.error("Error saat update:", error);
      Swal.fire("Error!", "Gagal mengupdate data.", "error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
        <div className="card-body" style={{ fontFamily: "'Poppins', sans-serif" }}>
  <h1 className="card-title text-center mb-4 fw-bold">
    <i className="fas fa-user-edit me-2"></i> Edit Data User
  </h1>
</div>

          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama</label>
              <input 
                type="text" 
                className="form-control" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Kosongkan jika tidak ingin mengubah" 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select 
                className="form-control" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                required
              >
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="restock">Restock</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100"
            >
              Simpan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default EditUser;