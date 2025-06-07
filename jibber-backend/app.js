import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(cookieParser());


app.use(notFound);
app.use(errorHandler);

export default app;
