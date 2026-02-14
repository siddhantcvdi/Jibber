import { Server } from 'socket.io';
import { AuthenticatedSocket } from '@/socket/types';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { Chat } from '@/models/chat.model';
import logger from '@/utils/logger';

export const registerChatHandlers = (
  io: Server,
  socket: AuthenticatedSocket,
  redis: Redis
) => {
  const userId = socket.user?._id;
  if (!userId) return;

  socket.on('chat:markRead', async (payload: { chatId: string }) => {
    try {
      const { chatId } = payload;

      if (!chatId || !Types.ObjectId.isValid(chatId)) {
        socket.emit('error', { message: 'Invalid chatId' });
        return;
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        socket.emit('error', { message: 'Chat not found' });
        return;
      }

      // Verify user is a participant
      const isParticipant = chat.users.some((u) => u.toString() === userId);
      if (!isParticipant) {
        socket.emit('error', { message: 'Not a participant of this chat' });
        return;
      }

      await chat.resetUnread(new Types.ObjectId(userId));
      logger.info(`✅ Unread reset for user ${userId} in chat ${chatId}`);
    } catch (err) {
      logger.error('Error in chat:markRead:', err);
    }
  });
};

