const koneksi = require("./db");

const selectBooking = (callback) => {
    const q = "SELECT * FROM booking";
    koneksi.query(q, callback);
};

const getHargaPerJam = (idunit, callback) => {
    const query = "SELECT harga_per_jam FROM unit_ps WHERE idunit = ?";
    
    koneksi.query(query, [idunit], (err, results) => {
        if (err) {
            return callback(err);  // Jika ada error, kembalikan error
        }
        
        // Jika unit ditemukan, kembalikan harga_per_jam
        if (results.length > 0) {
            callback(null, results[0].harga_per_jam);
        } else {
            callback(new Error("Unit PS tidak ditemukan"));
        }
    });
};

const insertBooking = (idmember, idtempat, idunit, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, callback) => {
    console.log(idunit)// Debugging

    const q = `INSERT INTO booking (idmember, idunit, idtempat, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    koneksi.query(q, [idmember, idunit, idtempat, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status], callback);
};


const updateBooking = (idsewa, idmember, idtempat, idunit, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, callback) => {
    const q = "UPDATE booking SET idmember = ?, idtempat = ?, idunit = ?, tanggal_booking = ?, tanggal_selesai = ?, jumlah_jam = ?, harga_booking = ?, metode_pembayaran = ?, jumlah_pembayaran = ?, status_pembayaran = ?, status = ?, updated_at = NOW() WHERE idbooking = ?";
    koneksi.query(q, [idmember, idtempat, idunit, tanggal_booking, tanggal_selesai, jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, idsewa], callback);
};


const selectByIdBooking = (idbooking, callback) => {
    const q = "SELECT * FROM booking WHERE idbooking = ?";
    koneksi.query(q, [idbooking], callback);
};

const deleteBooking = (id, callback) => {
    if(id){
        const q = "UPDATE booking set deleted_at = NOW() where idbooking = ?";
        koneksi.query(q, [id], callback);
    }else{
        console.error("ilegal akses")
    }
}

module.exports = {
    selectBooking,
    insertBooking,
    updateBooking,
    deleteBooking,
    getHargaPerJam,
    selectByIdBooking
}