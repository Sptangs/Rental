const Booking = require("../models/booking");

const index = (req, res) => {
    Booking.selectBooking((err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        if(result.length === 0) {
            return res.status(404).json({
                message:"booking kosong"
            });
        };
        res.status(200).json(result);
    });
};

const storeBooking = (req, res) => {
    console.log("Data yang diterima dari request:", req.body); // Debugging

    const { idmember, idtempat, idunit, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status } = req.body;

    if (idunit === undefined || idunit === null) {
        return res.status(400).json({ message: "idunit tidak boleh kosong!" });
    }

    Booking.insertBooking(idmember, idtempat, idunit, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Data Booking Berhasil Disimpan", userId: result.insertId });
    });
};


// const storeBooking = (req, res) => {
//     const { idmember, idunit, idtempat, tanggal_booking, tanggal_selesai, jumlah_jam, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status } = req.body;

//     // Validasi input wajib
//     if (!idmember || !idtempat || !tanggal_booking || !tanggal_selesai || !jumlah_jam) {
//         console.log("Error: Data booking tidak lengkap", req.body);
//         return res.status(400).json({ error: "Semua data booking harus diisi" });
//     }

//     // Format tanggal agar sesuai dengan MySQL DATETIME
//     const formatDate = (date) => new Date(date).toISOString().slice(0, 19).replace("T", " ");
//     const tglBooking = formatDate(tanggal_booking);
//     const tglSelesai = formatDate(tanggal_selesai);

//     if (idunit) {
//         // Jika menyewa unit PS, ambil harga per jam
//         Booking.getHargaPerJam(idunit, (err, harga_per_jam) => {
//             if (err) {
//                 console.error("Database error saat mengambil harga per jam:", err);
//                 return res.status(400).json({ error: err.message });
//             }
//             if (!harga_per_jam) {
//                 console.warn("Unit PS tidak ditemukan:", idunit);
//                 return res.status(404).json({ error: "Unit PS tidak ditemukan" });
//             }

//             const harga_booking = jumlah_jam * harga_per_jam;

//             // Validasi jumlah pembayaran jika status pembayaran lunas
//             if (status_pembayaran === "lunas" && jumlah_pembayaran < harga_booking) {
//                 console.warn("Pembayaran kurang:", { jumlah_pembayaran, harga_booking });
//                 return res.status(400).json({ error: "Jumlah pembayaran kurang dari harga booking" });
//             }

//             Booking.insertBooking(idmember, idunit, idtempat, tglBooking, tglSelesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, res);
//         });
//     } else {
//         // Jika hanya booking tempat, harga_booking bisa nol
//         const harga_booking = 0;
//         insertBooking(idmember, null, idtempat, tglBooking, tglSelesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, res);
//     }
// };


const EditBooking = (req, res) => {
    const { idmember, idtempat, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status } = req.body;
    const { idbooking } = req.params;
    Booking.updateBooking(idbooking, idmember, idtempat, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json("Update Booking Berhasil");
    });
};

const DestroyBooking = (req, res) => {
    const {id} = req.params;
    Booking.deleteBooking(id, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.status(200).json({message: "Data Berhasi Dihapus"});
    })
}

const showBooking = (req, res) => {
    const idbooking = parseInt(req.params.idbooking, 10);

    if (isNaN(idbooking)) {
        return res.status(400).json({ error: "Invalid booking ID" });
    }

    console.log(`Fetching booking with id: ${idbooking}`);

    Booking.selectByIdBooking(idbooking, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(results[0]);
    });
};



module.exports = {
    index,
    storeBooking,
    EditBooking,
    DestroyBooking,
    showBooking
}