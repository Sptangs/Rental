const User = require("../models/user");
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");

const index = (req, res) => {
    User.selectUsers((err, result) => {
        if(err){
            return res.status(500).json({error:err.message})
        }
        if(result.lenght === 0){
            return res.status(404).json({
                message:"user kosong"
            });
        };
        res.status(200).json(result)
    })
}

const StoreUser = (req, res) => {
    const {nama, email, password, role} = req.body;
    User.insertUsers(nama,email, password, role, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res
            .status(201)
            .json({message: "Data User Berhasil Disimpan", userId: result.insertId});
    });
};

const editUser = (req, res) => {
    const { id } = req.params;
    const { nama, email, password, role } = req.body;
    User.updateUsers(id, nama, email, password, role, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json("Update Data Berhasil");
    });
};

const showUser = (req, res) => {
    const { id } = req.params;
    User.selectUsersById(id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(results[0]);
    });
};

const destroyUser = (req, res) => {
    const {id} = req.params;
    User.deleteUser(id, (err, result) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        res.status(200).json("data berhasil dihapus");
    });
};

const Login = (req, res) => {
    const {email, password} = req.body;
    User.selectUsersByEmail(email, (err, result) => {
        if(err){
            return res.status(500).json({error:err.message})
        }
        if(result.length === 0){
            return res.status(404).json({
                message:"email tidak ada"
            })
        }
        const user = result[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if(!passwordIsValid){
            return res.status(401).json({message: "password salah"});
        }
        const token = jwt.sign({id: user.id}, "rahasia", {expiresIn: 86400});
        res.status(200).json({auth: true, token})
    })
};


module.exports = {
    index,
    StoreUser,
    editUser,
    destroyUser,
    Login,
    showUser
}