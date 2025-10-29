import { Server as SocketIOServer, Socket } from 'socket.io';
import logger from '@/utils/logger';
import {socketAuthMiddleware} from '@/socket/middlewares';
import { connectRedis } from '@/config/redis';
import { createAdapter } from '@socket.io/redis-adapter';

interface AuthenticatedSocket extends Socket {
  user?: {
    _id: string;
    email: string;
  };
}

export default function initializeSocket(io: SocketIOServer): void {

  io.use(socketAuthMiddleware);

  const redis = connectRedis();
  const pubClient = redis;
  const subClient = redis.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

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
