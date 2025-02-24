const koneksi = require("./db");

const selectMeja = (callback) => {
    const q = "SELECT * FROM meja";
    koneksi.query(q, callback);
};

const insertMeja = (nomor_tempat, status, callback) => {
    const q = "INSERT INTO meja (nomor_tempat, status) VALUES (?,?)";
    koneksi.query(q, [nomor_tempat, status], callback);
}

const selectMejaById = (idtempat, callback) => {
    const q = "Select * From meja where idtempat = ?";
    koneksi.query(q, [idtempat], callback);
}

const updateMeja = (idtempat, nomor_tempat, status, callback) => {
    const q = "UPDATE meja SET nomor_tempat = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE idtempat = ?";
    koneksi.query(q, [nomor_tempat, status, idtempat], callback);
};

const deleteMeja = (id, callback) => {
    if(id){
        const q = "UPDATE meja SET deleted_at = NOW() WHERE idtempat = ?";
        koneksi.query(q, [id],callback);
    }else{
        console.error("ilegal akses");
    }
};

module.exports = {
    selectMeja,
    insertMeja,
    updateMeja,
    deleteMeja
}