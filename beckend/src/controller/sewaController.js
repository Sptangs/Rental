const Sewa = require("../models/sewa");

const index = (req, res) => {
    Sewa.selectSewa((err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        if(result.length === 0){
            return res.status(404).json({
                message:"Sewa Kosong"
            });
        };
        res.status(200).json(result);
    });
};

const StoreSewa = (req, res) => {
    const {idmember, idunit, jumlah_hari, tanggal_sewa, tanggal_kembali, harga_sewa, denda, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status} = req.body;
    Sewa.insertSewa(idmember, idunit, jumlah_hari, tanggal_sewa, tanggal_kembali, harga_sewa, denda, metode_pembayaran, jumlah_pembayaran, status_pembayaran, status,(err, result) => {
        if(err){
            return res.status(500).json({error : err.message});
        }
        res
            .status(201)
            .json({message: "Data Sewa Berhasil Disimpan", userId: result.insertId});
    });
};

const EditSewa = (req, res) => {
    const {
        idmember, idunit, jumlah_hari, tanggal_sewa, tanggal_kembali,
        harga_sewa, denda, metode_pembayaran, jumlah_pembayaran,
        status_pembayaran, status
    } = req.body;

    const { idsewa } = req.params;

    // Validasi ID Sewa
    if (!idsewa) {
        return res.status(400).json({ error: "ID Sewa harus disediakan" });
    }

    // Validasi data yang diperlukan
    if (
        !idmember || !idunit || !jumlah_hari || !tanggal_sewa || !tanggal_kembali ||
        !harga_sewa || !metode_pembayaran || !jumlah_pembayaran ||
        !status_pembayaran || !status
    ) {
        return res.status(400).json({ error: "Semua field harus diisi" });
    }

    console.log(`Mengupdate penyewaan dengan ID: ${idsewa}`);

    // Panggil fungsi updateSewa
    Sewa.updateSewa(
        idsewa, idmember, idunit, jumlah_hari, tanggal_sewa,
        tanggal_kembali, harga_sewa, denda, metode_pembayaran,
        jumlah_pembayaran, status_pembayaran, status,
        (err, result) => {
            if (err) {
                console.error("Gagal mengupdate sewa:", err);
                return res.status(500).json({ error: "Terjadi kesalahan saat mengupdate data" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Data sewa tidak ditemukan" });
            }
            res.status(200).json({ message: "Update data berhasil", data: result });
        }
    );
};


const showSewa = (req, res) => {
    const idsewa = parseInt(req.params.idsewa, 10); // Konversi ke integer

    if (isNaN(idsewa)) {
        return res.status(400).json({ error: "Invalid sewa ID" });
    }

    console.log(`Fetching sewa with id: ${idsewa}`);

    Sewa.selectByIdSewa(idsewa, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "Sewa not found" });
        }

        res.status(200).json(results[0]);
    });
};



const DestroySewa = (req, res) => {
    const {id} =  req.params;
    Sewa.deleteSewa(id, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.status(200).json({message: "Data Berhasi Dihapus"});
    });
};

module.exports = {
    index,
    StoreSewa,
    EditSewa,
    DestroySewa,
    showSewa
}