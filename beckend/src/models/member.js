const koneksi = require("./db");
const bcrypt = require("bcrypt");

const selectMember = (callback) => {
    const q = "SELECT * From members";
    koneksi.query(q, callback);
};

const selectMembersByEmail = (email, callback) => {
    const q = "SELECT idmember, nama, email, password FROM members WHERE email = ?";
    koneksi.query(q, [email], callback);
}

const selectByIdMember = (idmember, callback) => {
    const query = "SELECT * FROM members WHERE idmember = ?";
    koneksi.query(query, [idmember], callback);
};

const insertMembers = (nama, email, password, no_hp, alamat, role, callback) => {
    if (password) {
        const hashedPass = bcrypt.hashSync(password, 10);
        const q = "Insert Into members(nama, email, password, no_hp, alamat, role) VALUES (?, ?, ?, ?, ?, ?)";
        koneksi.query(q, [nama, email, hashedPass, no_hp, alamat, role], callback);
    } else {
        console.error("password harus di isi");
    }
}

const updateMembers = (id, nama, email, password, no_hp, alamat, role, callback) => {
    if (password) {
        const hashedPass = bcrypt.hashSync(password, 10);
        const q = "UPDATE members SET nama=?, email=?, password=?, no_hp=?, alamat=?, role=?, updated_at=NOW() WHERE idmember=?";
        koneksi.query(q, [nama, email, hashedPass, no_hp, alamat, role, id], callback);
    } else {
        const q = "UPDATE members SET nama=?, email=?, no_hp=?, alamat=?, role=?, updated_at=NOW() WHERE idmember=?";
        koneksi.query(q, [nama, email, no_hp, alamat, role, id], callback);
    }
};

const deleteMember = (id, callback) => {
    if (id) {
        const q = "DELETE FROM members where idmember =?";
        koneksi.query(q, [id], callback);
    } else {
        console.error("ilegal akses");
    }
};

module.exports = {
    selectMember,
    selectMembersByEmail,
    insertMembers,
    updateMembers,
    deleteMember,
    selectByIdMember
}