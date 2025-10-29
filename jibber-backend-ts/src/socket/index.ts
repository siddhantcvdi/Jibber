import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '@/config';
import logger from '@/utils/logger';
import { User } from '@/models/user.model';
import socketAuthMiddleware from '@/socket/middlewares/auth.middleware';

interface AuthenticatedSocket extends Socket {
  user?: {
    _id: string;
    email: string;
  };
}

export default function initializeSocket(io: SocketIOServer): void {

  io.use(socketAuthMiddleware);

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user?._id;
    if (!userId) {
      logger.error('Socket connected without user ID');
      socket.disconnect();
      return;
    }

    console.log(`✅ User connected: ${userId} (Socket: ${socket.id})`);

    socket.on('disconnect', (reason) => {
      console.log(`❌ User disconnected: ${userId} (Socket: ${socket.id}), reason: ${reason}`);
    });
  });
}
