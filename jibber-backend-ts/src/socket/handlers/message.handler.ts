import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket, SendMessagePayload } from '@/socket/types';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { User } from '@/models/user.model';
import { Message } from '@/models/message.model';



export const registerMessageHandlers = (
  io: Server,
  socket: AuthenticatedSocket,
  redis: Redis
)=> {
  const userId = socket.user?._id;
  if(!userId) return;

  socket.on('message:send', async (payload: SendMessagePayload) => {
    const receiverId = new Types.ObjectId(payload.receiverId);
    const senderId = new Types.ObjectId(userId);

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      socket.emit('error', { message: 'Receiver not found' });
      return;
    }

    // Get the receiver's socket if user is online
    const receiverKey = `user:${receiverId}:socket`;
    const receiverSocketId = await redis.get(receiverKey);

    if (receiverSocketId) {
      const receiverSocket = io.sockets.sockets.get(receiverSocketId);
      if(receiverSocket) {
        receiverSocket.emit('message:receive', payload);
      }
    }

    const msg = await Message.create(payload);

  })
}