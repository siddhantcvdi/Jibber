import logger from '@/utils/logger';
import { Redis } from 'ioredis';

export const handleSocketConnection = async (io: any, socket: any, redis: Redis) => {
  const userId = socket.user?._id;
  if (!userId) return socket.disconnect();

  const userKey = `user:${userId}:socket`;

  try {
    const oldSocketId = await redis.get(userKey);
    if (oldSocketId && io.sockets.sockets.has(oldSocketId)) {
      // Delete any other socket from the same user
      // socket.disconnect() ~ It will disconnect the current socket
      io.sockets.sockets.get(oldSocketId)?.disconnect(true);
      logger.warn(`🔁 Replaced old socket ${oldSocketId} for user ${userId}`);
    }

    await redis.set(userKey, socket.id);
    logger.info(`✅ User ${userId} connected on socket ${socket.id}`);
  } catch (err) {
    logger.error("Redis set error:", err);
    socket.disconnect();
  }

  socket.on("disconnect", async () => {
    try {
      const currentSocket = await redis.get(userKey);
      if (currentSocket === socket.id) {
        await redis.del(userKey);
        logger.info(`User ${userId} disconnected`);
      }
    } catch (err) {
      logger.error("Redis cleanup error:", err);
    }
  });
};
