const Meja = require("../models/meja");
const { gantiStatusBooking } = require("./bookingController");

const index = (req, res) => {
    Meja.selectMeja((err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        if(result.length === 0){
            return res.status(404).json({
                message: "Meja Kosong"
            });
        }
        res.status(200).json(result);
    });
}

const showMeja = (req, res) => {
    const { idtempat } = req.params;
    Meja.selectMeja(idtempat, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(results[0]);
    });
};

const storeMeja = (req, res) => {
    const {nomor_tempat, status} = req.body;
    Meja.insertMeja(nomor_tempat, status,(err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res
            .status(201)
            .json({ message: "Data Member Berhasil Disimpan", userId: result.insertId});
    })
}

const editMeja = (req, res) => {
    const {nomor_tempat, status} = req.body;
    const {idtempat} = req.params;
    Meja.updateMeja(idtempat,nomor_tempat, status, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.status(200).json("Update Data Berhasil");
    })
}

const destroyMeja = (req, res) => {
    const {id} = req.params;
    Meja.deleteMeja(id, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.status(200).json({message: "Data Berhasi Dihapus"});
    })
}

const gantiMeja = (req, res) => {
    const { status } = req.body;
    const { idtempat } = req.params;

    if (!status) {
        return res.status(400).json({ error: "Status harus diberikan" });
    }

    Meja.updateStatusMeja(idtempat, status, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Meja tidak ditemukan" });
        }

        res.json({ message: "Status meja berhasil diperbarui" });
    });
};


module.exports = {
    index,
    storeMeja,
    editMeja,
    destroyMeja,
    showMeja,
    gantiMeja
}