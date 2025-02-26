import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditMember = () => {
  const { idmember } = useParams();
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [no_hp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [role, setRole] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getMemberById = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/members/${idmember}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setNama(data.nama);
        setEmail(data.email);
        setNoHp(data.no_hp);
        setAlamat(data.alamat);
        setRole(data.role);
      } catch (error) {
        console.error("Gagal mengambil data member:", error);
        Swal.fire("Error!", "Gagal mengambil data member.", "error");
      }
    };
    getMemberById();
  }, [idmember, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!nama || !email || !no_hp || !alamat || !role) {
      Swal.fire("Error!", "Semua field harus diisi!", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/members/${idmember}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama, email, no_hp, alamat, role }),
      });

      if (!response.ok) {
        throw new Error(`Gagal update, status: ${response.status}`);
      }

      Swal.fire("Berhasil!", "Data member berhasil diperbarui.", "success").then(() => {
        navigate("/admin/member");
      });
    } catch (error) {
      console.error("Gagal memperbarui data:", error);
      Swal.fire("Error!", "Gagal memperbarui data member.", "error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4>Edit Data Member</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Nama</label>
              <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">No HP</label>
              <input type="text" className="form-control" value={no_hp} onChange={(e) => setNoHp(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Alamat</label>
              <textarea className="form-control" value={alamat} onChange={(e) => setAlamat(e.target.value)} required></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="">Pilih Role</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success">
              <i className="fas fa-save me-2"></i> Simpan
            </button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/admin/member")}>
              <i className="fas fa-arrow-left me-2"></i> Kembali
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMember;
