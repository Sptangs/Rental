const Unit = require("../models/unit_ps");

const index = (req, res) => {
    Unit.selectUnitPs((err, result) => {
        if(err) {
            return res.status(500).json({error : err.message});
        }
        if (result.length === 0) { 
            return res.status(404).json({
                message: "Unit kosong"
            });
        }
        res.status(200).json(result);
    });
}

const showUnit = (req, res) => {
    const {idunit} = req.params;
    Unit.selectUnitById(idunit, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(results[0]);
        });
} ;

const storeUnitPs = (req, res) => {
    const {jenis_ps,harga_sewa,harga_per_jam, status, stok} = req.body;
    Unit.insertUnitPs(jenis_ps,harga_sewa,harga_per_jam, status,stok, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res
            .status(201)
            .json({ message: "Data Member Berhasil Disimpan", userId: result.insertId});
    });
};

const editUnitPs = (req, res) => {
    const {jenis_ps,harga_sewa,harga_per_jam, status, stok} = req.body;
    const {idunit} = req.params;
    Unit.updateUnitPs(idunit,jenis_ps, harga_sewa, harga_per_jam, status, stok,(err,result) => {
        if(err){
            return res.status(500),json({error : err.message});
        }
        res.status(200).json("Update Data Berhasil");
    });
};

const destroyUnitPs = (req, res) => {
    const {id} = req.params;
    Unit.deleteUnitPs(id, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.status(200).json({message: "Data Berhasi Dihapus"});
    });
};

module.exports = {
    index,
    storeUnitPs,
    editUnitPs,
    showUnit,
    destroyUnitPs
}

