const mysql = require("mysql2");
const koneksi = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
});

const createUserTableAdmin = (koneksi) => {
    const q = `CREATE Table If NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama varchar(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operator', 'restock'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;
    koneksi.query(q,(err,result) => {
        if(err){
            console.error("error buat table user", err.stack);
            return;
        }
        console.log("table user berhasil dibuat");
    })
};

const createTableMember = (koneksi) => {
    const q =`
    CREATE TABLE IF NOT EXISTS members(
    idmember INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password text,
    no_hp VARCHAR(20),
    alamat VARCHAR(255),
    role ENUM('Silver','Gold','Platinum'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
    `;
    koneksi.query(q,(err,result) => {
        if(err){
            console.error("error buat table member", err.stack);
            return;
        }
        console.log("table members berhasil dibuat");
    })
};

const createUnitPSTable = (koneksi) => {
    const q = `CREATE TABLE IF NOT EXISTS unit_ps(
    idunit int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    jenis_ps Varchar(100),
    harga_sewa DECIMAL(10, 2),
    harga_per_jam DECIMAL(10, 2),
    stok INT,
    status ENUM('tersedia','disewa','dipakai','perawatan'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
    `;
    koneksi.query(q, (err, result) => {
        if(err){
            console.error("error buat table unit_ps", err.stack);
            return;
        }
        console.log("tabel unit_ps berhasil dibuat")
    });
};

const createMejaTable = (koneksi) => {
    const q = ` CREATE TABLE IF NOT EXISTS meja(
    idtempat int primary key not null AUTO_INCREMENT,
    nomor_tempat varchar(15),
    status ENUM('tersedia','dipakai','dibooking'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
    )`;
    koneksi.query(q, (err, result) => {
        if(err){
            console.error("error buat table meja", err.stack);
            return;
        }
        console.log("tabel meja berhasil dibuat");
    })
}

const createSewaTable = (koneksi) => {
    const q = `CREATE TABLE IF NOT EXISTS sewa (
        idsewa INT PRIMARY KEY AUTO_INCREMENT,
        idmember INT,
        idunit INT,
        jumlah_hari INT,
        tanggal_sewa DATETIME,
        tanggal_kembali DATETIME,
        harga_sewa DECIMAL(10, 2),
        denda DECIMAL(10, 2),
        metode_pembayaran ENUM('Cash', 'Transfer'), -- Perbaikan di sini
        jumlah_pembayaran DECIMAL(10, 2),
        status_pembayaran ENUM('dibayar', 'belum dibayar', 'tertunda') DEFAULT 'tertunda',
        status ENUM('tertunda', 'berlangsung', 'selesai', 'dibatalkan') DEFAULT 'tertunda',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME DEFAULT NULL,
        FOREIGN KEY (idmember) REFERENCES members(idmember) ON DELETE SET NULL,
        FOREIGN KEY (idunit) REFERENCES unit_ps(idunit) ON DELETE SET NULL
    )`;
    koneksi.query(q, (err, result) => {
        if (err) {
            console.error("Gagal membuat tabel sewa:", err.stack);
            return;
        } else {
            console.log("Tabel sewa berhasil dibuat");
        }
    });
};

const createBookingTable = (koneksi) => {
    const q =`CREATE TABLE IF NOT EXISTS booking(
        idbooking int PRIMARY KEY AUTO_INCREMENT,
        idmember int,
        idtempat int,
        idunit int,
        tanggal_booking DATETIME,
        tanggal_selesai DATETIME,
        jumlah_jam int,
        harga_booking DECIMAL(10, 2),
        metode_pembayaran ENUM('Cash', 'Transfer'),
        jumlah_pembayaran DECIMAL(10, 2),
        status_pembayaran ENUM('dibayar','belum_dibayar', 'tertunda','dibatalkan') DEFAULT 'tertunda',
        status ENUM ('tertunda', 'berlangsung', 'selesai', 'dibatalkan') DEFAULT 'tertunda',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME DEFAULT NULL,
        FOREIGN KEY (idmember) REFERENCES members(idmember) ON DELETE SET NULL,
        FOREIGN KEY (idtempat) REFERENCES meja(idtempat) ON DELETE SET NULL,
        FOREIGN kEY (idunit) REFERENCES unit_ps(idunit) ON DELETE SET NULL

    )`;
    koneksi.query(q, (err, result) => {
        if(err){
            console.error("Gagal Membuat Table Booking", err.message);
        }else{
            console.log("Tabel Booking berhasil dibuat");
        }
    });
};

const migration = () => {
    koneksi.connect((err) => {
        if(err){
            console.error("Error koneksi ke database", err.stack);
            return;
        }
        console.log("berhasil konek mysql");
        koneksi.query(
            "CREATE DATABASE IF NOT EXISTS rental_ps",
            (err, result) => {
                if(err) {
                    console.error("Error membuat database rental", err.stack);
                    return;
                }
                console.log("Database berhasil dibuat atau sudah ada");
                const db = require("../models/db.js");
                createUserTableAdmin(db),
                createTableMember(db),
                createUnitPSTable(db),
                createMejaTable(db),
                createSewaTable(db),
                createBookingTable(db)
                koneksi.end();
            }
        )
    }) 
}

module.exports = migration;
