const koneksi = require('./db');
const bcrypt = require('bcrypt')

const selectUsers = (callback) => {
    const q = "select * from users";
    koneksi.query(q, callback);
};

const selectUsersByEmail = (email, callback) => {
    const q = "select * from users where email = ?";
    koneksi.query(q,[email], callback);
};

const selectUsersById = (id, callback) => {
    const q = "SELECT * FROM users  where id =?";
    koneksi.query(q, [id], callback)
};

const insertUsers = (nama, email, password, role, callback) => {
    if(password){
        const hashedPass = bcrypt.hashSync(password, 10);
        const q = "INSERT INTO users(nama, email, password, role) VALUES(?,?,?,?)";
        koneksi.query(q, [nama, email, hashedPass, role], callback);
    }else{
        console.error("Password Harus Di Isi");
    };
};

const updateUsers = (id, nama, email, password, role, callback) => {
    if (password) {
        const hashedPass = bcrypt.hashSync(password, 10);
        const q = "UPDATE users SET nama=?, email=?, password=?, role=?, updated_at=NOW() WHERE id=?";
        koneksi.query(q, [nama, email, hashedPass, role, id], callback);
    } else {
        const q = "UPDATE users SET nama=?, email=?, role=?, updated_at=NOW() WHERE id=?";
        koneksi.query(q, [nama, email, role, id], callback);
    }
};

const deleteUser = (id, callback) => {
    if(id){
        const q = "DELETE FROM users where id =?";
        koneksi.query(q, [id], callback);
    }else{
        console.error("ilegal akses");
    }
};

module.exports = 
{
    selectUsers,
    insertUsers,
    updateUsers,
    deleteUser,
    selectUsersByEmail,
    selectUsersById
}