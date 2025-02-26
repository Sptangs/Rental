import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const User = () => {
  const [dataUser, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const tampilData = async () => {
    const response = await fetch("http://localhost:3000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setUsers(data);
  };
  useEffect(() => {
    tampilData();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Yakin menghapus data?",
      showCancelButton: true,
      confirmButtonText: "Yakin",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:3000/api/users/" + id, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((res) => {
            window.location.reload();
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
                <Link to="/admin/adduser" className="btn btn-primary">
                  Tambah User
                </Link>
              </div>
              <table className="table table-striped table-bordered mt-2">
              <thead className="table-light text-center">
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>

                <tbody>
                  {dataUser.length > 0 ? (
                    dataUser.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <td className="text-center">
                          <Link
                            to={`/admin/edituser/${item.id}`}
                            className="btn btn-warning btn-sm"
                          >
                            <FaEdit /> Edit
                          </Link>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <FaTrash /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Tidak ada data
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

export default User;
