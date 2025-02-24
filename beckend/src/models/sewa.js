const koneksi= require("./db");

const selectSewa = (callback) => {
    const q = "SELECT * FROM sewa";
    koneksi.query(q, callback);
};

const insertSewa = (idmember, idunit, jumlah_hari, tanggal_sewa, tanggal_kembali, harga_sewa, denda, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, callback) => {
    const q = `INSERT INTO sewa (idmember, idunit, jumlah_hari, tanggal_sewa, tanggal_kembali, harga_sewa, denda, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    koneksi.query(q, [idmember, idunit, jumlah_hari, tanggal_sewa, tanggal_kembali, harga_sewa, denda, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status], callback);
};

// const getHargaPerJam = (idunit, callback) => {
//     const sql = "SELECT harga_sewa FROM unit_ps WHERE idunit = ?";
//     db.query(sql, [idunit], (err, results) => {
//         if (err) {
//             return callback(err, null);
//         }
//         if (results.length === 0) {
//             return callback(new Error("Unit PS tidak ditemukan"), null);
//         }
//         callback(null, results[0].harga_sewa);
//     });
// };
const selectByIdSewa = (idsewa, callback) => {
    const q = "SELECT * FROM sewa WHERE idsewa = ?";
    koneksi.query(q, [idsewa], callback);
};
const updateSewa = (idsewa, idmember, idunit, jumlah_hari, tanggal_sewa, tanggal_kembali, harga_sewa, denda, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, callback) => {
    const query = `UPDATE sewa SET idmember=?, idunit=?, jumlah_hari=?, tanggal_sewa=?, tanggal_kembali=?, harga_sewa=?, denda=?, metode_pembayaran=?, jumlah_pembayaran=?, status_pembayaran=?, status=? WHERE idsewa=?`;
    koneksi.query(query, [idmember, idunit, jumlah_hari, tanggal_sewa, tanggal_kembali, harga_sewa, denda, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status, idsewa], callback);
};


const deleteSewa = (id, callback) => {
    if(id){
        const q = "UPDATE sewa SET deleted_at = NOW() where idsewa = ?";
        koneksi.query(q,[id], callback);
    }else{
        console.error("ilegal akses");
    }
};

module.exports = {
    selectSewa,
    insertSewa,
    updateSewa,
    deleteSewa,
    selectByIdSewa
}