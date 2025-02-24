const Member = require("../models/member");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const index = (req, res) => {
    Member.selectMember((err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) { 
            return res.status(404).json({
                message: "Member kosong"
            });
        }
        res.status(200).json(result);
    });
};


const StoreMember = (req, res) => {
    const { nama, email, password, no_hp, alamat, role } = req.body;
    Member.insertMembers(nama, email, password, no_hp, alamat, role, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res
            .status(201)
            .json({ message: "Data Member Berhasil Disimpan", userId: result.insertId });
    });
};


const editMember = (req, res) => {
    const {id} = req.params;
    const {nama, email, password, no_hp, alamat, role} = req.body;
    Member.updateMembers(id, nama, email, password, no_hp, alamat, role, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.status(200).json("Update Data Berhasil");
    });
};

const showMember = (req, res) => {
    const { idmember } = req.params;

    Member.selectByIdMember(idmember, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(results[0]);
    });
};

const destroyMember = (req, res) => {
    const { id } = req.params;
    Member.deleteMember(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Data Berhasil Dihapus" });
    });
};

const loginMember = (req, res) => {
    const { email, password } = req.body;

    Member.selectMembersByEmail(email, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Email tidak ditemukan" });
        }

        const member = result[0];
        const passwordIsValid = bcrypt.compareSync(password, member.password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: "Password salah" });
        }

        const token = jwt.sign({ id: member.idmember }, "rahasia", { expiresIn: 86400 });

        res.status(200).json({
            auth: true,
            token,
            member: {
                idmember: member.idmember,
                email: member.email,
                nama: member.nama,
            },
        });
    });
};




module.exports = {
    index,
    StoreMember,
    editMember,
    destroyMember,
    loginMember,
    showMember
}

