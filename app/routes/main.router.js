import { Router } from 'express';
import defaultRouter from './default.router';
import rolRouter from './users/rol.router';
import userRouter from './users/user.router';
import authenticateService from '../modules/users/services/authenticate.service';
import tryErrorService from '../modules/users/services/try.error.service';

const mainRouter = Router();

mainRouter.post('/api/login', authenticateService.login);
mainRouter.use('/', authenticateService.authenticate, defaultRouter);
mainRouter.use(
	'/api/users',
	authenticateService.authenticate,
	userRouter,
	tryErrorService.tryError
);
mainRouter.use(
	'/api/rols',
	authenticateService.authenticate,
	rolRouter,
	tryErrorService.tryError
);

export default mainRouter;
