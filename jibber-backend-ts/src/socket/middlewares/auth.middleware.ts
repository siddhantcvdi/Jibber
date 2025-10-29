import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '@/config';
import { User } from '@/models/user.model';
import logger from '@/utils/logger';
import { AuthenticatedSocket } from '@/socket/types';

const socketAuthMiddleware = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    const decoded = jwt.verify(token, config.jwtAccessSecret) as { _id: string; email: string };
    const user = await User.findById(decoded._id);
    if (!user) return next(new Error('User not found'));

    socket.user = { _id: decoded._id, email: decoded.email };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') return next(new Error('Token expired'));
    if (err.name === 'JsonWebTokenError') return next(new Error('Invalid token'));
    logger.error('Socket authentication error:', err);
    next(new Error('Authentication failed'));
  }
};

export default socketAuthMiddleware;
