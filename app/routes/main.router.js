import { Router } from 'express';
import defaultRouter from './default.router';
import rolRouter from './users/rol.router';
import userRouter from './users/user.router';
import authenticateService from '../modules/users/services/authenticate.service';

const mainRouter = Router();

mainRouter.post('/api/login', authenticateService.login);
mainRouter.use('/api/users', authenticateService.authenticate, userRouter);
mainRouter.use('/api/rols', authenticateService.authenticate, rolRouter);

export default mainRouter;