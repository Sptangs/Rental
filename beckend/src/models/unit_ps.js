const koneksi = require('./db');

const selectUnitPs = (callback) => {
    const q = "SELECT * from unit_ps";
    koneksi.query(q, callback);
};

const insertUnitPs = (jenis_ps,harga_sewa,harga_per_jam, status, stok,callback) => {
    const q = "insert INTO unit_ps(jenis_ps, harga_sewa, harga_per_jam, status, stok) VALUES (?,?,?,?,?)";
    koneksi.query(q,[jenis_ps, harga_sewa, harga_per_jam, status, stok], callback);
}

const selectUnitById = (idunit, callback) => {
    const q = "SELECT * FROM unit_ps where idunit = ?"
    koneksi.query(q, [idunit], callback);

}

const updateUnitPs = (idunit, jenis_ps, harga_sewa, harga_per_jam, status, stok,callback) => {
    const q = `UPDATE unit_ps SET jenis_ps = ?, harga_sewa = ?, harga_per_jam = ?, status = ?, stok =? ,updated_at = NOW() WHERE idunit = ?`;
    koneksi.query(q, [jenis_ps, harga_sewa, harga_per_jam, status, stok ,idunit], callback);
};

const deleteUnitPs = (id, callback) => {
    if(id){
        const q = "DELETE FROM unit_ps where idunit = ?";
        koneksi.query(q, [id],callback);
    }else{
        console.error("ilegal akses");
    }
};

module.exports = {
    selectUnitPs,
    insertUnitPs,
    updateUnitPs,
    deleteUnitPs,
    selectUnitById
}