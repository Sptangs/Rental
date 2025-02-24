import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Members = () => {
  const [dataMembers, setMembers] = useState([]);
  const token = localStorage.getItem("token");

  const tampilData = async () => {
    const response = await fetch("http://localhost:3000/api/members", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setMembers(data);
  };

  useEffect(() => {
    tampilData();
  }, []);

  const handleDelete = (id) => {
    console.log("ID yang akan dihapus:", id); 

    if (!id) {
        Swal.fire("Error!", "ID tidak valid!", "error");
        return;
    }

    Swal.fire({
        icon: "warning",
        title: "Yakin menghapus data?",
        showCancelButton: true,
        confirmButtonText: "Yakin",
        cancelButtonText: "Batal",
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("Mengirim DELETE request ke API...");
            
            fetch(`http://localhost:3000/api/members/${id}`, {
                mode: "cors",
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Gagal menghapus, status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Response dari server:", data);
                Swal.fire("Dihapus!", "Data berhasil dihapus.", "success");
                tampilData();
            })
            .catch((error) => {
                console.error("Error saat menghapus:", error);
                Swal.fire("Error!", "Gagal menghapus data.", "error");
            });
        }
    });
};

  

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  to="/admin/addmember"
                  className="btn btn-primary"
                  style={{
                    borderRadius: "5px",
                    padding: "10px 20px",
                    marginTop: "10px",
                    fontSize: "1rem",
                    background: "blue",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "red";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "blue";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  Tambah Member
                </Link>
              </div>
              <table className="table table-striped table-bordered mt-2">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No HP</th>
                    <th>Alamat</th>
                    <th>Role</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>

                <tbody>
                  {dataMembers.length > 0 ? (
                    dataMembers.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.email}</td>
                        <td>{item.no_hp}</td>
                        <td>{item.alamat}</td>
                        <td>{item.role}</td>
                        <td>
                          <Link
                            to={`/admin/editmember/${item.idmember}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(item.idmember)}
                            className="btn btn-danger btn-sm"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Tidak ada data member
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Members;
