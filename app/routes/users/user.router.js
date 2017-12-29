import { Router } from 'express';
import userController from '../../modules/users/controllers/user.controller';

const userRouter = Router();

//Rutas de usuarios
userRouter.route('/')
    .get(userController.getAllUsers)
    .post(userController.findRolByPublicId, userController.createUser);

userRouter.route('/:publicId')
    .put(userController.updateUser)
    .get(userController.getUser)
    .delete(userController.removeUser)
    .patch(userController.activeUser);

export default userRouter;