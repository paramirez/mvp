import rolModel from '../models/rol.model';
import { rolPublicFieldAccess } from '../users.settings';

export default {
	/**
	 * @author Pablo Ramirez
	 * @description Ingresa un nuevo rol en la base de datos
	 */
	async createRol(req, res, next) {
		try {
			const rolQuery = new rolModel(req.body);
			const rol = await rolQuery.save();
			res.json({ status: 200 });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Consulta todos los roles que no se encuentren deshabilidatos
	 */
	async getAllRols(req, res, next) {
		try {
			const data = await rolModel.find({ isDeleted: false }, rolPublicFieldAccess);
			res.json({ status: 200, data });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Actualiza el rol.
	 */
	async updateRol(req, res, next) {
		try {
			const rolId = req.params.publicId || '';
			const rol = await rolModel.findOneAndUpdate(
				{ rolId, isDeleted: false },
				req.body
			);
			if (rol !== null) return res.json({ status: 200 });
			res.status(404).json({ status: 404 });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Consulta un rol apartir de su id publico
	 */
	async getRol(req, res, next) {
		try {
			const rolId = req.params.publicId;
			const data = await rolModel.findOne(
				{ rolId, isDeleted: false },
				rolPublicFieldAccess
			);
			if (data === null)
				return res.status(404).json({
					status: 404
				});
			res.json({ status: 200, data });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Deshabilita un rol a partir de su id publico
	 */
	async removeRol(req, res, next) {
		try {
			const rolId = req.params.publicId;
			const rol = await rolModel.findOneAndUpdate(
				{ rolId, isDeleted: false },
				{ isDeleted: true }
			);
			if (rol !== null) return res.json({ status: 200 });
			res.status(404).json({ status: 404 });
		} catch (error) {
			next(error);
		}
	},
	/**
	 * @author Pablo Ramirez
	 * @description Habilita un rol a partir de su id publico
	 */
	async activeRol(req, res, next) {
		try {
			const rolId = req.params.publicId;
			const rol = await rolModel.findOneAndUpdate(
				{ rolId, isDeleted: true },
				{ isDeleted: false }
			);
			if (rol !== null) return res.json({ status: 200 });
			res.status(404).json({ status: 404 });
		} catch (error) {
			next(error);
		}
	}
};
