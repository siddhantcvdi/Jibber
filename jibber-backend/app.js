import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFound, errorHandler } from './src/middlewares/error.middleware.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use(cookieParser());


app.use(notFound);
app.use(errorHandler);

export default app;
