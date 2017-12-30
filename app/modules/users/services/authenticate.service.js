import userModel from '../models//user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secrectKeySystem, expireTimeToken } from '../../../core/global';

export default {
	/**
	 * @author Pablo Ramirez
	 * @description Metodo que permite iniciar sesión usando JsonWebToken
	 */
	async login(req, res) {
		try {
			const user = await userModel
				.findOne({ email: req.body.email })
				.populate({ path: 'rol', match: { isDeleted: false } });
			if (user === null) return res.status(400).json({ message: 'Invalid email' });
			if (user.isDeleted || user.rol === null)
				return res.status(403).json({ message: 'User is disable' });
			if (!bcrypt.compareSync(req.body.password, user.password))
				return res.status(400).json({ message: 'Invalid password' });
			const token = jwt.sign(
				{ email: user.email, userId: user.id },
				secrectKeySystem,
				{
					expiresIn: expireTimeToken
				}
			);
			user.token = token;
			const userSaved = await user.save();
			res.json({ success: true, status: 200, token });
		} catch (error) {
			if (error.name === 'CastError') return res.status(400).json(error);
			res.status(500).json(error);
		}
	},

	/**
	 * @author Pablo Ramirez
	 * @description Middlerware que permite autenticarse para acceder a las distantas rutas
	 */
	authenticate(req, res, next) {
		const token = req.headers['x-access-token'] || '';
		if (token === '')
			return res.status(403).json({ success: false, message: 'Forbidden' });
		jwt.verify(token, secrectKeySystem, (err, decode) => {
			if (err)
				return res.status(403).json({ success: false, message: 'Forbidden' });
			req.decode = decode;
			next();
		});
	}
};
