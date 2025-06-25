import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';
import { Server as SocketIOServer } from 'socket.io';
import socketHandler from './src/socket/index.js';

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();

    // Create HTTP server from Express app
    const server = http.createServer(app);

    const io = new SocketIOServer(server, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    });
    socketHandler(io);

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  }
})();
