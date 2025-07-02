# Messaging and Socket System Issues & Solutions

This document outlines critical issues found in the Jibber messaging and socket systems, along with detailed solutions for each problem.

## 🚨 Critical Issues Summary

1. [Socket Authentication & Security](#1-socket-authentication--security-issues)
2. [Message Persistence & Synchronization](#2-message-persistence--synchronization-problems)
3. [Socket Connection Management](#3-socket-connection-management-issues)
4. [Message Ordering & Delivery](#4-message-ordering--delivery-issues)
5. [Error Handling Deficiencies](#5-error-handling-deficiencies)
6. [Authentication & Authorization Gaps](#6-authentication--authorization-gaps)
7. [Database Performance Issues](#7-database-performance-issues)
8. [Real-time State Management](#8-real-time-state-management-problems)
9. [Message Encryption/Decryption](#9-message-encryptiondecryption-issues)
10. [Production Readiness](#10-production-readiness-concerns)

---

## 1. Socket Authentication & Security Issues

### Problems
- Socket tokens expire without refresh mechanism
- Hard-coded backend URLs
- No automatic reconnection on auth failure

### Solutions

#### A. Implement Token Refresh for Socket Connections

**Backend: Add socket token refresh endpoint**
```javascript
// src/controllers/auth.controller.js
export const refreshSocketToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  
  if (!token) {
    return errorResponse(res, { message: 'Refresh token required', statusCode: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);
    
    if (!user || !user.refreshTokenHash) {
      return errorResponse(res, { message: 'Invalid refresh token', statusCode: 403 });
    }

    const { accessToken } = generateJwtTokens(user);
    
    return successResponse(res, {
      message: 'Socket token refreshed',
      data: { accessToken }
    });
  } catch (err) {
    return errorResponse(res, { message: 'Token refresh failed', statusCode: 403 });
  }
});
```

**Frontend: Enhanced socket store with token refresh**
```typescript
// src/store/socket.store.ts
interface SocketState {
  socket: Socket | null;
  isConnecting: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  connectSocket: () => void;
  disconnectSocket: () => void;
  handleTokenRefresh: () => Promise<void>;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnecting: false,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,

  connectSocket: () => {
    const { isConnecting, socket } = get();
    if (isConnecting || socket?.connected) return;

    set({ isConnecting: true });
    const accessToken = authStore.getState().accessToken;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const newSocket = io(backendUrl, {
      autoConnect: true,
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected ✅', newSocket.id);
      set({ isConnecting: false, reconnectAttempts: 0 });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected ❌', reason);
      set({ socket: null, isConnecting: false });
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        get().handleReconnect();
      }
    });

    newSocket.on('connect_error', async (error) => {
      console.error('Socket connection error:', error);
      
      if (error.message === 'Invalid token') {
        try {
          await get().handleTokenRefresh();
          get().handleReconnect();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          authStore.getState().clearAuth();
        }
      } else {
        get().handleReconnect();
      }
    });

    set({ socket: newSocket });
  },

  async handleTokenRefresh() {
    try {
      const response = await api.post('/auth/refresh-socket-token');
      const { accessToken } = response.data.data;
      authStore.getState().setAuth(accessToken, authStore.getState().user);
    } catch (error) {
      throw new Error('Failed to refresh socket token');
    }
  },

  handleReconnect() {
    const { reconnectAttempts, maxReconnectAttempts } = get();
    
    if (reconnectAttempts < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      
      setTimeout(() => {
        set({ reconnectAttempts: reconnectAttempts + 1 });
        get().connectSocket();
      }, delay);
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnecting: false, reconnectAttempts: 0 });
    }
  },
}));
```

#### B. Environment-Based Configuration

**Create environment configuration**
```typescript
// src/config/environment.ts
export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  socketUrl: import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
```

---

## 2. Message Persistence & Synchronization Problems

### Problems
- Inconsistent timestamp fields (`timestamp` vs `createdAt`)
- Race conditions in unread counts
- Sorting issues

### Solutions

#### A. Fix Message Model Schema

**Backend: Update message model**
```javascript
// src/models/message.model.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cipher: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  senderPublicIdKey: {
    type: String,
    required: true,
  },
  receiverPublicIdKey: {
    type: String,
    required: true,
  },
  senderPublicSigningKey: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  sequenceNumber: {
    type: Number,
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  clientTimestamp: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt
});

// Compound indexes for performance
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, deliveryStatus: 1 });

// Method to get next sequence number
messageSchema.statics.getNextSequenceNumber = async function(chatId) {
  const lastMessage = await this.findOne({ chatId }).sort({ sequenceNumber: -1 });
  return (lastMessage?.sequenceNumber || 0) + 1;
};

export const Message = mongoose.model('Message', messageSchema);
```

#### B. Atomic Unread Count Updates

**Backend: Improve chat model with atomic operations**
```javascript
// src/models/chat.model.js
chatSchema.methods.incUnreadAtomic = async function (receiverId) {
  const result = await this.constructor.findOneAndUpdate(
    { _id: this._id },
    { 
      $inc: { [`unreadCounts.${receiverId.toString()}`]: 1 },
      $set: { updatedAt: new Date() }
    },
    { new: true, upsert: false }
  );
  return result;
};

chatSchema.methods.resetUnreadAtomic = async function (userId) {
  const result = await this.constructor.findOneAndUpdate(
    { _id: this._id },
    { 
      $set: { 
        [`unreadCounts.${userId.toString()}`]: 0,
        updatedAt: new Date()
      }
    },
    { new: true }
  );
  return result;
};
```

#### C. Enhanced Message Controller

**Backend: Update messages controller**
```javascript
// src/controllers/messages.controller.js
export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user._id;
  
  if (!chatId) {
    return errorResponse(res, { message: 'Chat ID is required' });
  }
  
  // Verify chat exists and user has access
  const chat = await Chat.findOne({
    _id: chatId,
    users: userId
  });
  
  if (!chat) {
    return errorResponse(res, { message: 'Chat not found or access denied' });
  }
  
  // Get messages with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const messages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();
  
  // Mark messages as read
  await Message.updateMany(
    { 
      chatId, 
      receiver: userId, 
      deliveryStatus: { $ne: 'read' } 
    },
    { deliveryStatus: 'read' }
  );
  
  // Reset unread count atomically
  await chat.resetUnreadAtomic(userId);
  
  return successResponse(res, {
    message: 'Messages retrieved successfully',
    data: {
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: messages.length === parseInt(limit)
      }
    }
  });
});

export const markMessageAsDelivered = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;
  
  const message = await Message.findOneAndUpdate(
    { messageId, receiver: userId, deliveryStatus: 'sent' },
    { deliveryStatus: 'delivered' },
    { new: true }
  );
  
  if (!message) {
    return errorResponse(res, { message: 'Message not found' });
  }
  
  return successResponse(res, {
    message: 'Message marked as delivered',
    data: message
  });
});
```

---

## 3. Socket Connection Management Issues

### Problems
- Memory leaks in userMap and activeChatId
- No cleanup on disconnect
- Missing error recovery

### Solutions

#### A. Enhanced Socket Handler with Proper Cleanup

**Backend: Improved socket handler**
```javascript
// src/socket/index.js
import jwt from 'jsonwebtoken';
import { Message } from '../models/message.model.js';
import { Chat } from '../models/chat.model.js';
import logger from '../utils/logger.js';

class SocketManager {
  constructor() {
    this.userMap = new Map();
    this.activeChatId = new Map();
    this.socketUserMap = new Map(); // Track socket to user mapping
  }

  addUser(userId, socket) {
    // Remove existing socket for this user
    if (this.userMap.has(userId)) {
      const oldSocket = this.userMap.get(userId);
      this.removeSocket(oldSocket);
    }
    
    this.userMap.set(userId, socket);
    this.socketUserMap.set(socket.id, userId);
    this.activeChatId.set(userId, '');
    
    logger.info(`User ${userId} connected with socket ${socket.id}`);
  }

  removeUser(userId) {
    if (this.userMap.has(userId)) {
      const socket = this.userMap.get(userId);
      this.socketUserMap.delete(socket.id);
    }
    
    this.userMap.delete(userId);
    this.activeChatId.delete(userId);
    
    logger.info(`User ${userId} disconnected`);
  }

  removeSocket(socket) {
    const userId = this.socketUserMap.get(socket.id);
    if (userId) {
      this.removeUser(userId);
    }
  }

  getUserSocket(userId) {
    return this.userMap.get(userId);
  }

  setActiveChat(userId, chatId) {
    this.activeChatId.set(userId, chatId);
  }

  getActiveChat(userId) {
    return this.activeChatId.get(userId);
  }

  getConnectedUsers() {
    return Array.from(this.userMap.keys());
  }

  cleanup() {
    this.userMap.clear();
    this.activeChatId.clear();
    this.socketUserMap.clear();
  }
}

const socketManager = new SocketManager();

export default function socketHandler(io) {
  // Enhanced authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('No token provided'));
      }

      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      
      // Verify user exists in database
      const dbUser = await User.findById(user._id);
      if (!dbUser) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      logger.error('Socket authentication failed:', err);
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id;
    socketManager.addUser(userId, socket);

    // Send online status to user's contacts
    socket.broadcast.emit('userOnline', { userId });

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
      
      // Send offline status to user's contacts
      socket.broadcast.emit('userOffline', { userId });
      
      // Clean up user data
      socketManager.removeSocket(socket);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, receiver, sender, cipher, iv, signature, senderPublicIdKey, senderPublicSigningKey, receiverPublicIdKey, clientTimestamp } = data;

        // Validate sender matches authenticated user
        if (sender !== userId) {
          socket.emit('error', { message: 'Unauthorized sender' });
          return;
        }

        // Verify chat exists and user has access
        const chat = await Chat.findOne({
          _id: chatId,
          users: { $all: [sender, receiver] }
        });

        if (!chat) {
          socket.emit('error', { message: 'Chat not found or access denied' });
          return;
        }

        // Get sequence number
        const sequenceNumber = await Message.getNextSequenceNumber(chatId);

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
          sequenceNumber,
          clientTimestamp: new Date(clientTimestamp)
        });

        logger.info(`Message saved: ${message._id}`);

        // Send to receiver if online
        const receiverSocket = socketManager.getUserSocket(receiver);
        if (receiverSocket) {
          receiverSocket.emit('receivedMessage', {
            ...message.toObject(),
            messageId: message.messageId
          });

          // Only increment unread if receiver is not in this chat
          const receiverActiveChat = socketManager.getActiveChat(receiver);
          if (receiverActiveChat !== chatId) {
            await chat.incUnreadAtomic(receiver);
          }
        } else {
          // User is offline, increment unread count
          await chat.incUnreadAtomic(receiver);
        }

        // Confirm delivery to sender
        socket.emit('messageDelivered', {
          messageId: message.messageId,
          sequenceNumber: message.sequenceNumber
        });

      } catch (error) {
        logger.error('Error handling sendMessage:', error);
        socket.emit('error', { 
          message: 'Failed to send message',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });

    socket.on('setActiveChatId', (data) => {
      socketManager.setActiveChat(userId, data.activeChatId);
      logger.info(`User ${userId} set active chat: ${data.activeChatId}`);
    });

    socket.on('markMessageAsRead', async (data) => {
      try {
        const { messageId } = data;
        
        await Message.findOneAndUpdate(
          { messageId, receiver: userId },
          { deliveryStatus: 'read' }
        );

        // Notify sender that message was read
        const message = await Message.findOne({ messageId });
        if (message) {
          const senderSocket = socketManager.getUserSocket(message.sender);
          if (senderSocket) {
            senderSocket.emit('messageRead', { messageId });
          }
        }
      } catch (error) {
        logger.error('Error marking message as read:', error);
      }
    });

    socket.on('typing', (data) => {
      const { chatId, isTyping } = data;
      const receiverSocket = socketManager.getUserSocket(data.receiver);
      
      if (receiverSocket) {
        receiverSocket.emit('userTyping', {
          chatId,
          userId,
          isTyping
        });
      }
    });

    // Handle ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  // Graceful shutdown cleanup
  process.on('SIGTERM', () => {
    socketManager.cleanup();
    io.close();
  });

  process.on('SIGINT', () => {
    socketManager.cleanup();
    io.close();
  });
}

export { socketManager };
```

---

## 4. Message Ordering & Delivery Issues

### Problems
- No message delivery confirmation
- Inconsistent timestamp formats
- Missing ordering guarantees

### Solutions

#### A. Message Delivery System

**Frontend: Enhanced message store with delivery tracking**
```typescript
// src/store/message.store.ts
interface Message {
  id: string;
  text: string;
  isSentByMe: boolean;
  timestamp: string;
  deliveryStatus: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  sequenceNumber?: number;
  messageId?: string;
}

interface MessageStore {
  messages: Message[];
  pendingMessages: Map<string, Message>;
  handleSendMessage: () => Promise<void>;
  handleMessageDelivered: (data: any) => void;
  handleMessageRead: (data: any) => void;
  handleMessageFailed: (messageId: string) => void;
  retryFailedMessage: (messageId: string) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  pendingMessages: new Map(),

  async handleSendMessage() {
    const { newMessage, messages } = get();
    
    if (newMessage.trim() === '') return;

    const messageId = `temp_${Date.now()}_${Math.random()}`;
    const currentTime = new Date();
    
    const tempMessage: Message = {
      id: messageId,
      text: newMessage,
      isSentByMe: true,
      timestamp: currentTime.toISOString(),
      deliveryStatus: 'sending'
    };

    // Add to UI immediately
    set({
      messages: [...messages, tempMessage],
      newMessage: ''
    });

    // Add to pending messages
    get().pendingMessages.set(messageId, tempMessage);

    try {
      // Encrypt and prepare message
      const { encryptMessage, signMessage } = useCryptoStore.getState();
      const { getSelectedChatUser, getSelectedChat } = useChatStore.getState();
      const { user } = authStore.getState();
      
      const receiverPublicIdKey = getSelectedChatUser()?.publicIdKey;
      if (!receiverPublicIdKey) {
        throw new Error('Receiver public key not found');
      }

      const encryptedMessage = await encryptMessage(newMessage, receiverPublicIdKey);
      const signature = await signMessage(encryptedMessage.cipher);

      const messageData = {
        chatId: getSelectedChat()?._id,
        sender: user?._id,
        receiver: getSelectedChatUser()?._id,
        cipher: encryptedMessage.cipher,
        iv: encryptedMessage.iv,
        signature,
        senderPublicIdKey: user?.publicIdKey,
        senderPublicSigningKey: user?.publicSigningKey,
        receiverPublicIdKey,
        clientTimestamp: currentTime.toISOString(),
        tempMessageId: messageId
      };

      const { emitMessage } = useSocketStore.getState();
      emitMessage('sendMessage', messageData);

      // Update status to sent
      get().updateMessageStatus(messageId, 'sent');

    } catch (error) {
      console.error('Failed to send message:', error);
      get().handleMessageFailed(messageId);
    }
  },

  handleMessageDelivered(data) {
    const { messageId, tempMessageId } = data;
    const pendingMessage = get().pendingMessages.get(tempMessageId);
    
    if (pendingMessage) {
      // Update with server message ID
      get().updateMessage(tempMessageId, {
        messageId,
        deliveryStatus: 'delivered'
      });
      get().pendingMessages.delete(tempMessageId);
    }
  },

  handleMessageRead(data) {
    const { messageId } = data;
    get().updateMessageByServerId(messageId, { deliveryStatus: 'read' });
  },

  handleMessageFailed(messageId) {
    get().updateMessageStatus(messageId, 'failed');
  },

  updateMessageStatus(tempId: string, status: Message['deliveryStatus']) {
    set(state => ({
      messages: state.messages.map(msg => 
        msg.id === tempId ? { ...msg, deliveryStatus: status } : msg
      )
    }));
  },

  updateMessage(tempId: string, updates: Partial<Message>) {
    set(state => ({
      messages: state.messages.map(msg => 
        msg.id === tempId ? { ...msg, ...updates } : msg
      )
    }));
  },

  updateMessageByServerId(messageId: string, updates: Partial<Message>) {
    set(state => ({
      messages: state.messages.map(msg => 
        msg.messageId === messageId ? { ...msg, ...updates } : msg
      )
    }));
  },

  async retryFailedMessage(messageId: string) {
    const message = get().messages.find(m => m.id === messageId);
    if (message && message.deliveryStatus === 'failed') {
      // Reset message to sending and retry
      get().updateMessageStatus(messageId, 'sending');
      // Implement retry logic here
    }
  }
}));
```

#### B. Message Synchronization

**Frontend: Message sync service**
```typescript
// src/services/messageSync.ts
class MessageSyncService {
  private lastSyncTimestamp: Map<string, Date> = new Map();
  private syncInterval: number = 30000; // 30 seconds

  async syncMessages(chatId: string) {
    try {
      const lastSync = this.lastSyncTimestamp.get(chatId);
      const params = lastSync ? { since: lastSync.toISOString() } : {};
      
      const response = await api.get(`/messages/${chatId}/sync`, { params });
      const { messages, hasMore } = response.data.data;
      
      if (messages.length > 0) {
        const { mergeMessages } = useMessageStore.getState();
        mergeMessages(messages);
        this.lastSyncTimestamp.set(chatId, new Date());
      }
      
      return { messages, hasMore };
    } catch (error) {
      console.error('Message sync failed:', error);
      throw error;
    }
  }

  startPeriodicSync(chatId: string) {
    const intervalId = setInterval(() => {
      this.syncMessages(chatId);
    }, this.syncInterval);
    
    return () => clearInterval(intervalId);
  }
}

export const messageSyncService = new MessageSyncService();
```

---

## 5. Error Handling Deficiencies

### Problems
- Silent failures
- Missing validation
- Inadequate error messages

### Solutions

#### A. Comprehensive Error Handling

**Backend: Enhanced error middleware**
```javascript
// src/middlewares/error.middleware.js
import { errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

export const socketErrorHandler = (error, socket, next) => {
  logger.error('Socket error:', {
    error: error.message,
    stack: error.stack,
    socketId: socket.id,
    userId: socket.user?._id
  });

  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'An error occurred' 
    : error.message;

  socket.emit('error', {
    message: errorMessage,
    timestamp: new Date().toISOString()
  });

  next();
};

export const enhancedErrorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  logger.error(`${statusCode} - ${message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  return errorResponse(res, {
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
```

#### B. Frontend Error Boundary and Handling

**Frontend: Message error handling**
```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class MessageErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Message component error:', error, errorInfo);
    
    toast.error('An error occurred in the messaging system', {
      description: 'Please refresh the page if the problem persists.'
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-4">
            There was an error loading the messages.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced socket error handling
const useSocketErrors = () => {
  useEffect(() => {
    const { socket } = useSocketStore.getState();
    
    if (socket) {
      socket.on('error', (error) => {
        console.error('Socket error:', error);
        
        toast.error('Connection Error', {
          description: error.message || 'Failed to connect to messaging service'
        });
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        
        if (error.message === 'Authentication failed') {
          toast.error('Authentication Failed', {
            description: 'Please log in again'
          });
          authStore.getState().clearAuth();
        } else {
          toast.error('Connection Failed', {
            description: 'Unable to connect to messaging service'
          });
        }
      });
    }
  }, []);
};
```

---

## 6. Authentication & Authorization Gaps

### Problems
- No chat permission verification
- Missing sender verification
- No rate limiting

### Solutions

#### A. Enhanced Authorization

**Backend: Chat permission middleware**
```javascript
// src/middlewares/chat.middleware.js
export const verifyChatAccess = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  if (!chatId) {
    return errorResponse(res, { message: 'Chat ID is required', statusCode: 400 });
  }

  const chat = await Chat.findOne({
    _id: chatId,
    users: userId
  });

  if (!chat) {
    return errorResponse(res, { 
      message: 'Chat not found or access denied', 
      statusCode: 403 
    });
  }

  req.chat = chat;
  next();
});

export const verifyMessageAccess = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findOne({
    messageId,
    $or: [{ sender: userId }, { receiver: userId }]
  });

  if (!message) {
    return errorResponse(res, { 
      message: 'Message not found or access denied', 
      statusCode: 403 
    });
  }

  req.message = message;
  next();
});
```

#### B. Rate Limiting

**Backend: Rate limiting middleware**
```javascript
// src/middlewares/rateLimit.middleware.js
import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/response.js';

export const messageRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: 'Too many messages sent, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `message_${req.user._id}`,
  handler: (req, res) => {
    return errorResponse(res, {
      message: 'Rate limit exceeded',
      statusCode: 429
    });
  }
});

export const chatRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 new chats per 5 minutes
  keyGenerator: (req) => `chat_${req.user._id}`,
  handler: (req, res) => {
    return errorResponse(res, {
      message: 'Too many chat requests',
      statusCode: 429
    });
  }
});

// Socket rate limiting
class SocketRateLimiter {
  constructor() {
    this.userLimits = new Map();
    this.windowMs = 60000; // 1 minute
    this.maxRequests = 30;
  }

  isAllowed(userId) {
    const now = Date.now();
    const userLimit = this.userLimits.get(userId) || { count: 0, resetTime: now + this.windowMs };

    if (now > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = now + this.windowMs;
    }

    if (userLimit.count >= this.maxRequests) {
      return false;
    }

    userLimit.count++;
    this.userLimits.set(userId, userLimit);
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [userId, limit] of this.userLimits.entries()) {
      if (now > limit.resetTime) {
        this.userLimits.delete(userId);
      }
    }
  }
}

export const socketRateLimiter = new SocketRateLimiter();

// Clean up old rate limit data every 5 minutes
setInterval(() => {
  socketRateLimiter.cleanup();
}, 5 * 60 * 1000);
```

---

## 7. Database Performance Issues

### Problems
- Inefficient queries
- N+1 query problems
- Missing indexes

### Solutions

#### A. Optimized Queries

**Backend: Improved chat controller**
```javascript
// src/controllers/chat.controller.js
export const getAllChatsOfUser = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const { page = 1, limit = 20 } = req.query;

  if (!currentUserId) {
    return errorResponse(res, { message: "User not authenticated", statusCode: 401 });
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Use aggregation pipeline for better performance
  const chatsAggregation = await Chat.aggregate([
    // Match chats for current user
    { $match: { users: currentUserId } },
    
    // Lookup users data
    {
      $lookup: {
        from: 'users',
        localField: 'users',
        foreignField: '_id',
        as: 'usersData',
        pipeline: [
          { $project: { username: 1, profilePhoto: 1, email: 1, publicIdKey: 1, publicSigningKey: 1 } }
        ]
      }
    },
    
    // Lookup last message
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: 'chatId',
        as: 'lastMessage',
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ]
      }
    },
    
    // Add computed fields
    {
      $addFields: {
        otherUser: {
          $arrayElemAt: [
            {
              $filter: {
                input: '$usersData',
                cond: { $ne: ['$$this._id', currentUserId] }
              }
            },
            0
          ]
        },
        lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
        unreadCount: {
          $ifNull: [{ $toInt: `$unreadCounts.${currentUserId.toString()}` }, 0]
        }
      }
    },
    
    // Project final structure
    {
      $project: {
        _id: 1,
        details: '$otherUser',
        lastMessage: 1,
        unreadCount: 1,
        createdAt: 1,
        updatedAt: 1
      }
    },
    
    // Sort by last activity
    { $sort: { 'lastMessage.createdAt': -1, updatedAt: -1 } },
    
    // Pagination
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);

  return successResponse(res, {
    message: "Chats retrieved successfully",
    data: {
      chats: chatsAggregation,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: chatsAggregation.length === parseInt(limit)
      }
    }
  });
});
```

#### B. Database Indexes

**Backend: Enhanced indexes**
```javascript
// src/models/chat.model.js
// Add compound indexes for better performance
chatSchema.index({ users: 1, updatedAt: -1 });
chatSchema.index({ updatedAt: -1 });

// src/models/message.model.js
// Optimized indexes for common queries
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, deliveryStatus: 1 });
messageSchema.index({ messageId: 1 }, { unique: true });
messageSchema.index({ deliveryStatus: 1, receiver: 1 });

// src/models/user.model.js
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ publicIdKey: 1 });
```

---

## 8. Real-time State Management Problems

### Problems
- State desynchronization
- Missing presence indicators
- Incomplete chat state

### Solutions

#### A. Enhanced State Management

**Frontend: Improved chat store**
```typescript
// src/store/chats.store.ts
interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  onlineUsers: Set<string>;
  typingUsers: Map<string, Set<string>>; // chatId -> Set of user IDs
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  setSelectedChat: (chat: Chat | null) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setUserTyping: (chatId: string, userId: string, isTyping: boolean) => void;
  syncChatsOrder: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  selectedChat: null,
  onlineUsers: new Set(),
  typingUsers: new Map(),
  isLoading: false,
  error: null,

  setChats: (chats) => set({ chats, isLoading: false, error: null }),

  addChat: (chat) => {
    const { chats } = get();
    const existingIndex = chats.findIndex(c => c._id === chat._id);
    
    if (existingIndex >= 0) {
      // Update existing chat
      const updatedChats = [...chats];
      updatedChats[existingIndex] = { ...updatedChats[existingIndex], ...chat };
      set({ chats: updatedChats });
    } else {
      // Add new chat at the top
      set({ chats: [chat, ...chats] });
    }
  },

  updateChat: (chatId, updates) => {
    const { chats } = get();
    const updatedChats = chats.map(chat => 
      chat._id === chatId ? { ...chat, ...updates } : chat
    );
    set({ chats: updatedChats });
  },

  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    
    // Notify socket about active chat change
    const { emitMessage } = useSocketStore.getState();
    emitMessage('setActiveChatId', { activeChatId: chat?._id || '' });
  },

  setUserOnline: (userId) => {
    const { onlineUsers } = get();
    const newOnlineUsers = new Set(onlineUsers);
    newOnlineUsers.add(userId);
    set({ onlineUsers: newOnlineUsers });
  },

  setUserOffline: (userId) => {
    const { onlineUsers } = get();
    const newOnlineUsers = new Set(onlineUsers);
    newOnlineUsers.delete(userId);
    set({ onlineUsers: newOnlineUsers });
  },

  setUserTyping: (chatId, userId, isTyping) => {
    const { typingUsers } = get();
    const newTypingUsers = new Map(typingUsers);
    
    if (!newTypingUsers.has(chatId)) {
      newTypingUsers.set(chatId, new Set());
    }
    
    const chatTypingUsers = newTypingUsers.get(chatId)!;
    
    if (isTyping) {
      chatTypingUsers.add(userId);
    } else {
      chatTypingUsers.delete(userId);
    }
    
    set({ typingUsers: newTypingUsers });
  },

  syncChatsOrder: () => {
    const { chats } = get();
    const sortedChats = [...chats].sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.updatedAt;
      const bTime = b.lastMessage?.createdAt || b.updatedAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    set({ chats: sortedChats });
  }
}));
```

#### B. Presence Management

**Frontend: User presence service**
```typescript
// src/services/presenceService.ts
class PresenceService {
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds

  start() {
    this.stop(); // Clear any existing interval
    
    this.heartbeatInterval = setInterval(() => {
      const { socket } = useSocketStore.getState();
      if (socket?.connected) {
        socket.emit('heartbeat', { timestamp: Date.now() });
      }
    }, this.HEARTBEAT_INTERVAL);

    // Listen for visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  stop() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleVisibilityChange = () => {
    const { socket } = useSocketStore.getState();
    
    if (document.hidden) {
      socket?.emit('userAway');
    } else {
      socket?.emit('userBack');
    }
  };
}

export const presenceService = new PresenceService();
```

---

## 9. Message Encryption/Decryption Issues

### Problems
- Poor error handling in crypto operations
- Missing key validation

### Solutions

#### A. Robust Crypto Error Handling

**Frontend: Enhanced crypto store**
```typescript
// src/store/crypto.store.ts
interface CryptoError extends Error {
  code: string;
  recoverable: boolean;
}

const createCryptoError = (message: string, code: string, recoverable = false): CryptoError => {
  const error = new Error(message) as CryptoError;
  error.code = code;
  error.recoverable = recoverable;
  return error;
};

interface CryptoStore {
  // ... existing properties
  
  encryptMessageSafe: (plaintext: string, receiverPublicKey: string) => Promise<{ cipher: string; iv: string } | null>;
  decryptMessageSafe: (encryptedMessage: EncryptedMessage) => Promise<string | null>;
  validateKeys: (publicIdKey?: string, publicSigningKey?: string) => boolean;
}

const useCryptoStore = create<CryptoStore>((set, get) => ({
  // ... existing properties

  async encryptMessageSafe(plaintext: string, receiverPublicKey: string) {
    try {
      // Validate inputs
      if (!plaintext || typeof plaintext !== 'string') {
        throw createCryptoError('Invalid plaintext provided', 'INVALID_INPUT');
      }
      
      if (!receiverPublicKey || typeof receiverPublicKey !== 'string') {
        throw createCryptoError('Invalid receiver public key', 'INVALID_KEY');
      }

      // Validate key format
      if (!get().validateKeys(receiverPublicKey)) {
        throw createCryptoError('Invalid key format', 'INVALID_KEY_FORMAT');
      }

      const result = await get().encryptMessage(plaintext, receiverPublicKey);
      
      if (!result || !result.cipher || !result.iv) {
        throw createCryptoError('Encryption failed', 'ENCRYPTION_FAILED');
      }

      return result;
    } catch (error) {
      console.error('Encryption error:', error);
      
      if (error instanceof Error && 'code' in error) {
        const cryptoError = error as CryptoError;
        
        if (cryptoError.code === 'INVALID_KEY' || cryptoError.code === 'INVALID_KEY_FORMAT') {
          toast.error('Invalid encryption key', {
            description: 'Please refresh the chat and try again'
          });
        } else {
          toast.error('Failed to encrypt message', {
            description: 'Please try again'
          });
        }
      } else {
        toast.error('Encryption error', {
          description: 'An unexpected error occurred'
        });
      }
      
      return null;
    }
  },

  async decryptMessageSafe(encryptedMessage: EncryptedMessage) {
    try {
      // Validate encrypted message structure
      if (!encryptedMessage || typeof encryptedMessage !== 'object') {
        throw createCryptoError('Invalid encrypted message format', 'INVALID_MESSAGE');
      }

      const { cipher, iv, signature, senderPublicIdKey, senderPublicSigningKey } = encryptedMessage;
      
      if (!cipher || !iv || !signature || !senderPublicIdKey || !senderPublicSigningKey) {
        throw createCryptoError('Missing required encryption fields', 'MISSING_FIELDS');
      }

      // Validate sender keys
      if (!get().validateKeys(senderPublicIdKey, senderPublicSigningKey)) {
        throw createCryptoError('Invalid sender keys', 'INVALID_SENDER_KEYS');
      }

      const result = await get().decryptMessage(encryptedMessage);
      
      if (!result || typeof result !== 'string') {
        throw createCryptoError('Decryption failed', 'DECRYPTION_FAILED');
      }

      return result;
    } catch (error) {
      console.error('Decryption error:', error);
      
      if (error instanceof Error && 'code' in error) {
        const cryptoError = error as CryptoError;
        
        switch (cryptoError.code) {
          case 'INVALID_SENDER_KEYS':
            toast.error('Invalid sender keys', {
              description: 'This message may have been tampered with'
            });
            break;
          case 'DECRYPTION_FAILED':
            toast.error('Failed to decrypt message', {
              description: 'You may not have the correct keys'
            });
            break;
          default:
            toast.error('Decryption error', {
              description: 'Unable to read this message'
            });
        }
      }
      
      return '[Unable to decrypt message]';
    }
  },

  validateKeys(publicIdKey?: string, publicSigningKey?: string): boolean {
    try {
      if (!publicIdKey || typeof publicIdKey !== 'string') return false;
      if (publicSigningKey && typeof publicSigningKey !== 'string') return false;
      
      // Basic format validation (adjust based on your key format)
      const keyRegex = /^[A-Za-z0-9+/=]+$/;
      
      if (!keyRegex.test(publicIdKey)) return false;
      if (publicSigningKey && !keyRegex.test(publicSigningKey)) return false;
      
      // Length validation (adjust based on your key lengths)
      if (publicIdKey.length < 32) return false;
      if (publicSigningKey && publicSigningKey.length < 32) return false;
      
      return true;
    } catch {
      return false;
    }
  }
}));
```

---

## 10. Production Readiness Concerns

### Problems
- Hard-coded URLs
- Missing environment configuration
- No monitoring/logging
- Missing health checks

### Solutions

#### A. Environment Configuration

**Backend: Environment configuration**
```javascript
// src/config/environment.js
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'SERVER_SETUP'
];

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateEnvironment();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoUri: process.env.MONGO_URI,
  
  // JWT
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  
  // OPAQUE
  serverSetup: process.env.SERVER_SETUP,
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Rate limiting
  messageRateLimit: parseInt(process.env.MESSAGE_RATE_LIMIT) || 30,
  chatRateLimit: parseInt(process.env.CHAT_RATE_LIMIT) || 10,
  
  // Socket
  socketPingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
  socketPingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'app.log',
  
  // Development
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
```

#### B. Health Checks and Monitoring

**Backend: Health check endpoints**
```javascript
// src/controllers/health.controller.js
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import mongoose from 'mongoose';
import { socketManager } from '../socket/index.js';

export const healthCheck = asyncHandler(async (req, res) => {
  const checks = {
    database: false,
    socket: false,
    memory: false,
    uptime: process.uptime()
  };

  // Database health
  try {
    await mongoose.connection.db.admin().ping();
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  // Socket health
  try {
    const connectedUsers = socketManager.getConnectedUsers();
    checks.socket = true;
    checks.connectedUsers = connectedUsers.length;
  } catch (error) {
    console.error('Socket health check failed:', error);
  }

  // Memory health
  const memoryUsage = process.memoryUsage();
  checks.memory = memoryUsage.heapUsed < memoryUsage.heapTotal * 0.9;
  checks.memoryUsage = {
    used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
    percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
  };

  const isHealthy = checks.database && checks.socket && checks.memory;
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  });
});

export const readinessCheck = asyncHandler(async (req, res) => {
  // Check if all critical services are ready
  const ready = {
    database: mongoose.connection.readyState === 1,
    server: true
  };

  const isReady = Object.values(ready).every(Boolean);

  return res.status(isReady ? 200 : 503).json({
    ready: isReady,
    timestamp: new Date().toISOString(),
    checks: ready
  });
});
```

#### C. Enhanced Logging

**Backend: Structured logging**
```javascript
// src/utils/logger.js
import winston from 'winston';
import { config } from '../config/environment.js';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);

const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  defaultMeta: { service: 'jibber-backend' },
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: config.logFile,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
  ],
});

if (config.isDevelopment) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Socket event logging
export const logSocketEvent = (event, data) => {
  logger.info('Socket event', {
    event,
    userId: data.userId,
    socketId: data.socketId,
    timestamp: new Date().toISOString()
  });
};

// Message logging
export const logMessage = (action, messageData) => {
  logger.info('Message action', {
    action,
    messageId: messageData.messageId,
    chatId: messageData.chatId,
    sender: messageData.sender,
    receiver: messageData.receiver,
    timestamp: new Date().toISOString()
  });
};

export default logger;
```

#### D. Docker Configuration

**Backend: Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/health || exit 1

CMD ["node", "server.js"]
```

**Docker Compose for development**
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/jibber
      - CORS_ORIGIN=https://yourfrontend.com
    depends_on:
      - mongo
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  mongo_data:
```

---

## Implementation Priority

### Phase 1 (Critical - Week 1)
1. Fix message model schema and sorting issue
2. Implement proper socket authentication with token refresh
3. Add comprehensive error handling
4. Fix memory leaks in socket management

### Phase 2 (High Priority - Week 2)
5. Implement message delivery confirmation system
6. Add proper authorization checks
7. Optimize database queries and add indexes
8. Add rate limiting

### Phase 3 (Medium Priority - Week 3-4)
9. Implement robust crypto error handling
10. Add presence management
11. Add health checks and monitoring
12. Environment configuration

### Phase 4 (Enhancement - Week 5+)
13. Message synchronization service
14. Advanced state management
15. Production deployment configuration
16. Performance monitoring and analytics

## Testing Strategy

### Unit Tests
- Test all crypto operations with invalid inputs
- Test socket authentication with expired tokens
- Test message delivery confirmation flow
- Test rate limiting functionality

### Integration Tests
- Test complete message sending flow
- Test socket reconnection scenarios
- Test database query performance
- Test error handling across components

### Load Testing
- Test socket connection limits
- Test message throughput
- Test database performance under load
- Test memory usage under stress

## Monitoring and Alerts

### Key Metrics
- Socket connection count
- Message delivery rate
- Database query performance
- Memory and CPU usage
- Error rates by type

### Alerts
- High error rates
- Socket connection failures
- Database connectivity issues
- Memory leaks
- Rate limit violations

This comprehensive solution addresses all identified issues and provides a roadmap for implementing a robust, production-ready messaging system.
