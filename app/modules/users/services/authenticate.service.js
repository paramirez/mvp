import userModel from '../models//user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secrectKeySystem, expireTimeToken } from '../../../core/global';

//Definir middlerwares
function login(req, res, next) {
    userModel.findOne({ email: req.body.email })
        .populate({
            path: 'rol',
            match: { isDeleted: false }
        })
        .exec((err, user) => {
            if (err) {
                if (err.name === "CastError") {
                    res.status(404).json({ success: false, message: `User with value (${err.value}) not found` });
                } else {
                    res.status(500).json(err)
                }
            } else {
                if (user !== null) {
                    if (!user.isDeleted || user.rol !== null) {
                        bcrypt.compare(req.body.password, user.password, (err, passwordMatch) => {
                            if (err) { res.status(500).json(err) }
                            if (passwordMatch) {
                                const token = jwt.sign({ email: user.email, rol: user.rol.rolId, publicId: user.userId }, secrectKeySystem, { expiresIn: expireTimeToken });
                                user.token = token;
                                user.save((err) => {
                                    if (err) { res.status(500).json(err) }
                                    else {
                                        res.json({ success: true, token });
                                    }
                                });
                            } else {
                                res.status(400).json({ success: false, message: 'Invalid password' });
                            }
                        });
                    } else {
                        res.status(403).json({ success: false, message: 'The user is disable' });
                    }
                } else {
                    res.status(400).json({ success: false, message: 'Invalid email' });
                }
            }
        });
};

function authenticate(req, res, next) {
    const token = req.headers['x-access-token'] || '';
    if (token !== '') {
        jwt.verify(token, secrectKeySystem, (err, decode) => {
            if (err) {
                res.status(403).json({ success: false, message: 'Forbidden' });
            } else {
                req.decode = decode;
                next();
            }
        });
    } else {
        res.status(403).json({ success: false, message: 'Forbidden' });
    }
};


export default {
    login,
    authenticate
};