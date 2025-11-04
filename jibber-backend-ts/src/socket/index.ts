import { Server as SocketIOServer } from 'socket.io';
import {socketAuthMiddleware} from '@/socket/middlewares';
import { connectRedis } from '@/config/redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { handleSocketConnection, registerMessageHandlers } from '@/socket/handlers';
import { AuthenticatedSocket } from '@/socket/types';

export default function initializeSocket(io: SocketIOServer): void {

  io.use(socketAuthMiddleware);

  // Redis configuration
  const redis = connectRedis();
  const pubClient = redis;
  const subClient = redis.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket: AuthenticatedSocket) => {
    handleSocketConnection(io, socket, pubClient);
    registerMessageHandlers(io, socket, pubClient);
  });
}
