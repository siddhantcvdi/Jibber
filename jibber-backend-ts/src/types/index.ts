export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat {
  _id: string;
  participants: string[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface SocketUser {
  userId: string;
  socketId: string;
}

export interface MessageData {
  chatId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
}

export interface TypingData {
  chatId: string;
  isTyping: boolean;
}
