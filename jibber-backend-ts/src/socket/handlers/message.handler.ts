import { Server } from 'socket.io';
import { AuthenticatedSocket, SendMessagePayload } from '@/socket/types';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { User } from '@/models/user.model';



export const registerMessageHandlers = (
  io: Server,
  socket: AuthenticatedSocket,
  redis: Redis
)=> {
  const userId = socket.user?._id;
  if(!userId) return;

  socket.on('message:send', async (payload: SendMessagePayload) => {
    // const receiverId = new Types.ObjectId(payload.receiverId);
    // const senderId = new Types.ObjectId(userId);
    //
    // const receiverExists = await User.exists({ _id: receiverId });
    // if (!receiverExists) {
    //   return socket.emit('error', { message: 'Receiver not found' });
    // }

    console.log(payload.cipher);


  })
}