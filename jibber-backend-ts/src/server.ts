import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from '@/app';
import config from '@/config';
import { connectDB } from '@/config/database';
import logger from '@/utils/logger';

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Handle user authentication and join rooms
  socket.on('join-user', (userId: string) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined their personal room`);
  });

  // Handle joining chat rooms
  socket.on('join-chat', (chatId: string) => {
    socket.join(`chat-${chatId}`);
    logger.info(`Socket ${socket.id} joined chat ${chatId}`);
  });

  // Handle leaving chat rooms
  socket.on('leave-chat', (chatId: string) => {
    socket.leave(`chat-${chatId}`);
    logger.info(`Socket ${socket.id} left chat ${chatId}`);
  });

  // Handle typing indicators
  socket.on('typing', (data: { chatId: string; isTyping: boolean; userId: string }) => {
    socket.to(`chat-${data.chatId}`).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();

    // Start the server
    server.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
      logger.info(`📊 Health check available at http://localhost:${config.port}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

// Start the server
startServer();

export { io };
