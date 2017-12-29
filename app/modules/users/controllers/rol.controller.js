import rolModel from '../models/rol.model';

function rolError(err, res) {
    if (err.name === "CastError") {
        res.status(404).json({ success: false, message: `Rol with value (${err.value}) not found` });
    } else {
        res.status(500).json(err)
    }
};

function createRol(req, res) {
    const rolQuery = new rolModel(req.body);
    rolQuery.save((err, rol) => {
        if (err) { 
            if(err.code === 11000) {
                res.status(400).json({success:false, message: err.errmsg});
            }else {
                res.status(500).json({success:false, message: err});
            }
        }
        else {
            if (rol) { res.json({ success: true, message: 'Rol created' }) }
            else { res.json(500).json({ success: true, message: 'Rol create not found' }) }
        }
    });
};

function getAllRols(req, res) {
    rolModel.find({ isDeleted: false }, 'name isDeleted rolId -_id', (err, rols) => {
        if (err) { res.status(500).json(err) }
        else {
            res.json({ success: true, rols });
        }
    });
};

function updateRol(req, res) {
    const rolId = req.params.publicId;
    rolModel.findOneAndUpdate({ rolId, isDeleted: false }, req.body, (err, rol) => {
        if (err) { rolError(err, res) }
        else { res.json({ success: true, message: 'Rol updated' }) }
    });
};

function getRol(req, res) {
    const rolId = req.params.publicId;
    rolModel.findOne({ rolId, isDeleted: false }, 'name isDeleted rolId -_id', (err, rol) => {
        if (err) { rolError(err, res) }
        else {
            if (rol !== null) {
                res.json({ success: true, rol })
            } else {
                res.status(404).json({ success: false, message: 'Rol not found' });
            }
        }
    });
};

function removeRol(req, res) {
    const rolId = req.params.publicId;
    rolModel.findOneAndUpdate({ rolId, isDeleted: false }, { isDeleted: true }, (err, rol) => {
        if (err) { rolError(err, res) }
        else { res.json({ success: true, message: 'Rol remove' }) }
    });
};

function activeRol(req, res) {
    const rolId = req.params.publicId;
    rolModel.findOneAndUpdate({ rolId, isDeleted: true }, { isDeleted: false }, (err, rol) => {
        if (err) { rolError(err, res) }
        else { res.json({ success: true, message: 'Rol activated' }) }
    });
};

export default {
    createRol,
    getAllRols,
    updateRol,
    getRol,
    removeRol,
    activeRol
};