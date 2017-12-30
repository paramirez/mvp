import userModel from '../models/user.model';
import rolModel from '../models/rol.model';
import { userPublicFieldAccess, rolPublicFieldAccess } from '../users.settings';

export default {
	/**
	 * @author Pablo Ramirez
	 * @description Middleware que consulta un rol por su id publico,
	 * si no se especifica el id del rol a través de la petición, saltara
	 * a la siguiente función, de encontrar el rol los agregara
	 * a la petición y saltara a la siguiente función.
	 */
	async findRolByPublicId(req, res, next) {
		try {
			const rolId = req.body.rol || '';
			if (rolId === '') next();
			const rol = await rolModel.findOne({ rolId: req.body.rol, isDeleted: false });
			if (rol === null)
				return res.status(404).json({ status: 404, errmsg: 'rol not defined' });
			req.body.rol = rol;
			next();
		} catch (error) {
			req.errmsg = 'rol not found';
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Registra un usuario en la base de datos, de ocurrir
	 * un error de validación lo enviara al stack de metodos.
	 */
	async createUser(req, res, next) {
		try {
			const userQuery = new userModel(req.body);
			const user = await userQuery.save();
			res.json({ status: 200 });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Consulta todos los usuarios que no se encuentren
	 * deshabilidatos y los filtra para enviar solo los usuarios
	 * que tengan su rol habilitado.
	 */
	async getAllUsers(req, res, next) {
		try {
			const data = await userModel
				.find({ isDeleted: false }, userPublicFieldAccess)
				.populate({
					path: 'rol',
					select: rolPublicFieldAccess,
					match: { isDeleted: false }
				});
			res.json({
				status: 200,
				data: data.filter(user => user.rol !== null)
			});
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Actualiza un usuario, si se encuentra un error de validación
	 * saltara a la siguiente función en el stack para que trate el error.
	 */
	async updateUser(req, res, next) {
		try {
			const userId = req.params.publicId;
			const user = await userModel.findOneAndUpdate(
				{ userId, isDeleted: false },
				req.body
			);
			if (user !== null) return res.json({ status: 200 });
			res.status(404).json({ status: 404 });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Consulta un solo usuario a partir de su id publico
	 * que se encuentre habilitado y que su rol se encuentre habilitado.
	 */
	async getUser(req, res, next) {
		try {
			const userId = req.params.publicId;
			const data = await userModel
				.findOne({ userId, isDeleted: false }, userPublicFieldAccess)
				.populate({
					path: 'rol',
					select: rolPublicFieldAccess,
					match: { isDeleted: false }
				});
			if (data !== null && data.rol !== null)
				return res.json({ status: 200, data });
			res.status(404).json({ status: 404 });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Consulta y dehabilita el usuario a partir de su id publico.
	 */
	async removeUser(req, res) {
		try {
			const userId = req.params.publicId;
			const user = await userModel.findOneAndUpdate(
				{ userId, isDeleted: false },
				{ isDeleted: true }
			);
			if (user !== null) return res.json({ status: 200 });
			res.status(404).json({ status: 404 });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Consulta y habilita el usuario a partir de su id publico.
	 */
	async activeUser(req, res) {
		try {
			const userId = req.params.publicId;
			const user = userModel.findOneAndUpdate(
				{ userId, isDeleted: true },
				{ isDeleted: false }
			);
			if (user !== null) return res.json({ status: 200 });
			res.status(404).json({ status: 404 });
		} catch (error) {
			next(error);
		}
	}
};
