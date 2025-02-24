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
const formatDateForMySQL = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
};


const updateBooking = (
    idsewa, idmember, idtempat, idunit, tanggal_booking, tanggal_selesai, 
    jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, 
    status_pembayaran, status, callback
) => {
    console.log("Data yang diterima untuk update:", {
        idsewa, idmember, idtempat, idunit, 
        tanggal_booking, tanggal_selesai, jumlah_jam, 
        harga_booking, metode_pembayaran, jumlah_pembayaran, 
        status_pembayaran, status
    });

    // **1. Pastikan semua nilai memiliki tipe yang benar**
    idsewa = Number(idsewa) || 0;
    idmember = Number(idmember) || 0;
    idtempat = Number(idtempat) || 0;
    idunit = Number(idunit) || 0; // Jika idunit adalah ID, pastikan bukan tanggal
    jumlah_jam = Number(jumlah_jam) || 0;
    harga_booking = Number(harga_booking) || 0;
    jumlah_pembayaran = Number(jumlah_pembayaran) || 0;
    status_pembayaran = status_pembayaran ? String(status_pembayaran) : "";
    status = status ? String(status) : ""; // Hindari function dalam status
    metode_pembayaran = metode_pembayaran ? String(metode_pembayaran) : "";

    // **2. Pastikan tanggal memiliki format yang benar**
    const formatDateForMySQL = (date) => {
        if (!date || isNaN(new Date(date).getTime())) {
            return null; // Jika tidak valid, kembalikan NULL
        }
        return new Date(date).toISOString().slice(0, 19).replace("T", " ");
    };

    const formattedTanggalBooking = formatDateForMySQL(tanggal_booking);
    const formattedTanggalSelesai = formatDateForMySQL(tanggal_selesai);

    console.log("Formatted dates:", { formattedTanggalBooking, formattedTanggalSelesai });

    // **3. Pastikan tidak ada NULL yang bisa menyebabkan error**
    if (!formattedTanggalBooking || !formattedTanggalSelesai) {
        return callback(new Error("Tanggal Booking atau Tanggal Selesai tidak valid"), null);
    }

    // **4. Jalankan Query dengan Data yang Sudah Bersih**
    const q = `UPDATE booking SET 
        idmember = ?, idtempat = ?, idunit = ?, 
        tanggal_booking = ?, tanggal_selesai = ?, jumlah_jam = ?, 
        harga_booking = ?, metode_pembayaran = ?, jumlah_pembayaran = ?, 
        status_pembayaran = ?, status = ?, updated_at = NOW() 
        WHERE idbooking = ?`;

    koneksi.query(
        q, [
            idmember, idtempat, idunit, formattedTanggalBooking, formattedTanggalSelesai, 
            jumlah_jam, harga_booking, metode_pembayaran, jumlah_pembayaran, 
            status_pembayaran, status, idsewa
        ], 
        (err, result) => {
            if (err) {
                console.error("Error saat update booking:", err);
            }
            callback(err, result);
        }
    );
};



module.exports = { updateBooking };



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