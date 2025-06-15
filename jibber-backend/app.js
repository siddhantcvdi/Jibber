import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFound, errorHandler } from './src/middlewares/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js'
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use(notFound);

export default app;
