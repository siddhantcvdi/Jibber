import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket, SendMessagePayload } from '@/socket/types';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { User } from '@/models/user.model';
import { Message } from '@/models/message.model';
import { Chat } from '@/models/chat.model';

export const registerMessageHandlers = (
  io: Server,
  socket: AuthenticatedSocket,
  redis: Redis
) => {
  const userId = socket.user?._id;
  if (!userId) return;

  socket.on('message:send', async (payload: SendMessagePayload) => {
    const receiverId = new Types.ObjectId(payload.receiverId);
    const senderId = new Types.ObjectId(userId);

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      socket.emit('error', { message: 'Receiver not found' });
      return;
    }

    // Save message and update unread count before emitting to receiver
    // This prevents a race condition where the receiver's chat:markRead
    // (resetUnread) fires before incUnread, leaving a stale unread count.
    const msg = await Message.create(payload);
    const chat = await Chat.findByUsers(receiverId, senderId);
    if (chat) {
      await chat.incUnread(receiverId);
    }

    // Now emit to the receiver — if they have the chat open,
    // their frontend will fire chat:markRead to reset the count.
    const receiverKey = `user:${receiverId}:socket`;
    const receiverSocketId = await redis.get(receiverKey);

    if (receiverSocketId) {
      const receiverSocket = io.sockets.sockets.get(receiverSocketId);
      if (receiverSocket) {
        receiverSocket.emit('message:receive', payload);
      }
    }
  });
};
