import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user?: {
    _id: string;
    email: string;
  };
}

export interface SendMessagePayload {
  chatId: string;
  senderId: string;
  receiverId: string;
  cipher: string;
  iv: string;
  signature: string;
  senderPublicIdKey: string;
  senderPublicSigningKey: string;
  receiverPublicIdKey: string;
  timestamp: string;
}