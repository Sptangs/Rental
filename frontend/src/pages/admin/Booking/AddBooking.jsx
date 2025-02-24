import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddBooking = () => {
  const [members, setMembers] = useState([]);
  const [tempats, setTempats] = useState([]);
  const [units, setUnits] = useState([]);
  const [hargaPerJam, setHargaPerJam] = useState(0);
  const [formData, setFormData] = useState({
    idmember: "",
    idtempat: "",
    idunit: "",
    jumlah_jam: "",
    tanggal_booking: "",
    metode_pembayaran: "cash",
    status: "Pending",
    harga_booking: 0,
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
    fetchTempats();
    fetchUnits();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Gagal mengambil data member:", error);
    }
  };

  const fetchTempats = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/meja", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTempats(data.filter((tempat) => tempat.status === "tersedia"));
    } catch (error) {
      console.error("Gagal mengambil data tempat:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/unit", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error("Gagal mengambil data unit PS:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "jumlah_jam") {
      const jumlahJam = parseInt(value) || 0;
      newFormData.harga_booking = hargaPerJam * jumlahJam;
    }

    setFormData(newFormData);
  };

  const handleUnitChange = (e) => {
    const idunit = e.target.value;
    const selectedUnit = units.find((unit) => unit.idunit === parseInt(idunit));
    const harga = selectedUnit ? selectedUnit.harga_per_jam : 0;

    setHargaPerJam(harga);

    setFormData({
      ...formData,
      idunit,
      harga_booking: harga * (parseInt(formData.jumlah_jam) || 1),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Token yang dikirim:", token);
    console.log("Data yang dikirim:", formData);

    if (
      !formData.idmember ||
      !formData.idtempat ||
      !formData.idunit ||
      !formData.jumlah_jam ||
      !formData.tanggal_booking
    ) {
      Swal.fire("Error!", "Harap isi semua field!", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/booking", {
        method: "POST",
        mode:"cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error dari server:", errorResponse);
        throw new Error(errorResponse.message || "Gagal menambahkan booking.");
      }

      Swal.fire("Berhasil!", "Booking berhasil ditambahkan.", "success");
      navigate("/admin/booking");
    } catch (error) {
      console.error("Gagal menambahkan booking:", error);
      Swal.fire("Error!", error.message, "error");
    }
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Tambah Booking</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Member</label>
                    <select
                      name="idmember"
                      className="form-control"
                      value={formData.idmember}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Member</option>
                      {members.map((member) => (
                        <option key={member.idmember} value={member.idmember}>
                          {member.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tempat</label>
                    <select
                      name="idtempat"
                      className="form-control"
                      value={formData.idtempat}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Pilih Tempat</option>
                      {tempats.map((tempat) => (
                        <option key={tempat.idtempat} value={tempat.idtempat}>
                          {tempat.nomor_tempat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Unit PS</label>
                    <select
                      name="idunit"
                      className="form-control"
                      value={formData.idunit}
                      onChange={handleUnitChange}
                      required
                    >
                      <option value="">Pilih Unit PS</option>
                      {units.map((unit) => (
                        <option key={unit.idunit} value={unit.idunit}>
                          {unit.jenis_ps} - Rp {unit.harga_per_jam}/jam
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Jumlah Jam</label>
                    <input
                      type="number"
                      name="jumlah_jam"
                      className="form-control"
                      value={formData.jumlah_jam}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Harga Booking</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`Rp ${formData.harga_booking}`}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label>Tanggal Booking</label>
                    <input
                      type="date"
                      name="tanggal_booking"
                      className="form-control"
                      value={formData.tanggal_booking}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Metode Pembayaran</label>
                    <select
                      name="metode_pembayaran"
                      className="form-control"
                      value={formData.metode_pembayaran}
                      onChange={handleChange}
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>

                  <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary">
                      Simpan
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={() => navigate("/admin/booking")}
                    >
                      Kembali
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddBooking;
