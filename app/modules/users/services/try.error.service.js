export default {
	/**
	 * @author Pablo Ramirez
	 * @description Metodo que permite tratar los errores como middleware
	 */
	tryError(error, req, res, next) {
		const errmsg = req.errmsg || error;
		if (error.name === 'ValidationError') {
			return res.status(400).json({ status: 400, errmsg: errmsg });
		}
		if (error.code === 11000) {
			return res.status(400).json({ status: 400, errmsg: errmsg.errmsg });
		}
		if (error.name === 'CastError') {
			return res.status(404).json({ status: 404, errmsg });
		} else {
			return res.status(500).json({ status: 500, errmsg });
		}
	}
};
