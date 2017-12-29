import { Router } from 'express';

const defaultRouter = Router();

defaultRouter.get('/', (req, res) => {
    res.json({ message: `Funciono` });
});

export default defaultRouter;