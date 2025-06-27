import jwt from 'jsonwebtoken';
import { Message } from '../models/message.model.js';

const userMap = new Map();

export default function socketHandler(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    
    if (!token) {
      return next(new Error('No token provided'));
    }

    try {
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}, User: ${socket.user?._id}`);
    userMap.set(socket.user?._id, socket)

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
      userMap.delete(socket.user?.id);
    });

    socket.on('sendMessage', async (data)=>{
      const {chatId, receiver, sender,cipher, iv, signature, senderPublicIdKey, senderPublicSigningKey, timestamp, receiverPublicIdKey} = data;
      const message = await Message.create({
        chatId,
        sender,
        receiver,
        cipher,
        iv,
        signature,
        senderPublicIdKey,
        senderPublicSigningKey,
        receiverPublicIdKey,
        timestamp
      });
      console.log(message);
      if(userMap.has(receiver)){
      const receiverSocket = userMap.get(receiver)
      receiverSocket.emit('receivedMessage', message)
      }
    })
  });
}
