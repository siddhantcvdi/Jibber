import jwt from 'jsonwebtoken'; // or any validation logic

export default function socketHandler(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log(token);
    
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
    console.log(`✅ Socket connected: ${socket.id}, User: ${socket.user?.userId}`);

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
}
