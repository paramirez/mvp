import userModel from '../models/user.model';
import rolModel from '../models/rol.model';

function userError(err, res) {
    if (err.name === "CastError") {
        res.status(404).json({ success: false, message: `User with value (${err.value}) not found` });
    } else {
        res.status(500).json(err)
    }
};

//Middelware find rol;
function findRolByPublicId(req, res, next) {
    rolModel.findOne({ rolId: req.body.rol, isDeleted: false }, (err, rol) => {
        if (err) {
            if (err.name === "CastError") {
                res.status(404).json({ success: false, message: `Rol with value (${err.value}) not found` });
            } else {
                res.status(500).json(err)
            }
        } else {
            if (rol !== null) {
                req.body.rol = rol;
                next();
            } else {
                res.status(404).json({ success: false, message: 'Rol not found' });
            }
        }
    });
};


function createUser(req, res) {
    const userQuery = new userModel(req.body);
    userQuery.save((err, user) => {
        if (err) { } if (err) {
            if (err.code === 11000) {
                res.status(400).json({ success: false, message: err.errmsg });
            } else {
                if (err.name === "ValidationError") {
                    res.status(400).json({ success: false, message: err.message });
                } else {
                    res.status(500).json({ success: false, message: err });
                }
            }
        }
        else {
            if (user) { res.json({ success: true, message: 'User created' }) }
            else { res.json(500).json({ success: false, message: 'User create not found' }) }
        }
    });
};

function getAllUsers(req, res) {
    userModel.find({ isDeleted: false }, 'email isDeleted userId -_id')
        .populate({
            path: 'rol',
            select: 'name isDeleted rolId -_id',
            match: { isDeleted: false }
        })
        .exec((err, users) => {
            if (err) { res.status(500).json(err) }
            else {
                res.json({ success: true, users: users.filter(user => user.rol !== null) });
            }
        });
};

function updateUser(req, res) {
    const userId = req.params.publicId;
    userModel.findOneAndUpdate({ userId, isDeleted: false }, req.body, (err) => {
        if (err) { userError(err, res) }
        else { res.json({ success: true, message: 'User updated' }) }
    });
};

function getUser(req, res) {
    const userId = req.params.publicId;
    userModel.findOne({ userId, isDeleted: false }, 'email isDeleted userId -_id')
        .populate({
            path: 'rol',
            select: 'name rolId isDeleted -_id',
            match: { isDeleted: false }
        })
        .exec((err, user) => {
            if (err) { userError(err, res) }
            else {
                if (user !== null) {
                    res.json({ success: true, user })
                } else {
                    res.status(404).json({ success: false, message: 'User not found' });
                }
            }
        });
};

function removeUser(req, res) {
    const userId = req.params.publicId;
    userModel.findOneAndUpdate({ userId, isDeleted: false }, { isDeleted: true }, (err) => {
        if (err) { userError(err, res) }
        else { res.json({ success: true, message: 'User remove' }) }
    });
};

function activeUser(req, res) {
    const userId = req.params.publicId;
    userModel.findOneAndUpdate({ userId, isDeleted: true }, { isDeleted: false }, (err) => {
        if (err) { userError(err, res) }
        else { res.json({ success: true, message: 'User activated' }) }
    });
};

export default {
    findRolByPublicId,
    createUser,
    getAllUsers,
    updateUser,
    getUser,
    removeUser,
    activeUser
};