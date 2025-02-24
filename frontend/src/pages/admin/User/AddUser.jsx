import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AddUser = () => {
    const [existingEmails, setExistingEmails] = useState([]);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/users/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setExistingEmails(data.map((user) => user.email));
                }
            } catch (error) {
                console.error("Error fetching emails:", error);
            }
        };
        fetchEmails();
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fData = {};
        const frmel = event.target;

        for (let el of frmel.elements) {
            if (el.name) fData[el.name] = el.value;
        }
        if (existingEmails.includes(fData.email)) {
            return Swal.fire({
                icon: "error",
                text: "Email sudah digunakan",
            });
        }

        // Kirim data ke backend
        try {
            const response = await fetch("http://localhost:3000/api/users/", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(fData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Swal.fire({
                    icon: "error",
                    text: errorData.message || "Terjadi kesalahan",
                });
            } else {
                event.target.reset();
                Swal.fire({
                    icon: "success",
                    text: "Simpan Berhasil",
                    timer: 1000,
                }).then(() => {
                    window.location.href = '/admin/user';
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Gagal menyimpan data",
            });
            console.error("Error:", error);
        }
    };

    return (
        <>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col">
                            <h1 className="m-0">Data User</h1>
                        </div>
                        <div className="col">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Input User</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="card">
                                <div className="card-header">
                                    <Link to="/admin/user" className="btn btn-primary float-start">Lihat Data</Link>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="nama">Nama</label>
                                            <input type="text" name="nama" className="form-control" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input type="email" name="email" className="form-control" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input type="password" name="password" className="form-control" required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="role">Role</label>
                                            <select name="role" id="" className="form-control">
                                                <option value="">-- Pilih Role --</option>
                                                <option value="admin">Admin</option>
                                                <option value="opertator">Operator</option>
                                                <option value="restock">Restock</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-primary">Simpan</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddUser;
