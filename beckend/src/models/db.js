const mysql = require("mysql2");
const koneksi = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"rental_ps",
});
koneksi.connect((err) => {
    if(err){
        console.error("Error Koneksi Ke Database", err.stack);
        return;
    }
    console.log("Berhasil Koneksi Ke Database rental_ps");
});

module.exports = koneksi;