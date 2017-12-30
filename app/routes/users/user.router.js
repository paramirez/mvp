import { Router } from 'express';
import userController from '../../modules/users/controllers/user.controller';
const userRouter = Router();

userRouter
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.findRolByPublicId, userController.createUser);

userRouter
	.route('/:publicId')
	.put(userController.findRolByPublicId, userController.updateUser)
	.get(userController.getUser)
	.delete(userController.removeUser)
	.patch(userController.activeUser);

export default userRouter;
