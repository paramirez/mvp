import { Router } from 'express';
import rolController from '../../modules/users/controllers/rol.controller';

const rolRouter = Router();

//Rutas de roles
rolRouter.route('/')
    .get(rolController.getAllRols)
    .post(rolController.createRol);

rolRouter.route('/:publicId')
    .put(rolController.updateRol)
    .get(rolController.getRol)
    .delete(rolController.removeRol)
    .patch(rolController.activeRol);

export default rolRouter;