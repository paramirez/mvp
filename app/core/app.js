import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { PORT } from './global';
import mainRouter from '../routes/main.router';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(mainRouter);

app.listen(PORT, () => console.log(`Run in port ${PORT}`));

export default app;
