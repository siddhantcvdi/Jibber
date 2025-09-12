# Jibber Backend TypeScript

A robust TypeScript backend for the Jibber messaging application built with Express.js, Socket.IO, and MongoDB.

## Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast and minimalist web framework
- **Socket.IO**: Real-time bidirectional event-based communication
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT Authentication**: Secure user authentication
- **Rate Limiting**: API rate limiting for security
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Centralized error handling
- **CORS**: Cross-origin resource sharing configuration
- **Security**: Helmet for security headers
- **Validation**: Input validation with express-validator
- **Development Tools**: Hot reload with nodemon, ESLint, Prettier

## Project Structure

```
src/
├── config/
│   ├── index.ts          # Configuration management
│   └── database.ts       # Database connection
├── controllers/          # Route controllers
├── middlewares/          # Custom middleware
├── models/              # Mongoose models
├── routes/              # API routes
├── socket/              # Socket.IO handlers
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── app.ts               # Express app setup
└── server.ts            # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd jibber-backend-ts
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/jibber
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:5173
```

### Development

Start the development server with hot reload:
```bash
npm run dev
```

### Production

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests
- `npm run clean` - Clean build directory

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication (Coming Soon)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (Coming Soon)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Chats (Coming Soon)
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get chat by ID
- `PUT /api/chats/:id` - Update chat
- `DELETE /api/chats/:id` - Delete chat

### Messages (Coming Soon)
- `GET /api/messages/:chatId` - Get messages for chat
- `POST /api/messages` - Send new message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

## Socket.IO Events

### Client to Server
- `join-user` - Join user's personal room
- `join-chat` - Join a chat room
- `leave-chat` - Leave a chat room
- `typing` - Send typing indicator

### Server to Client
- `user-typing` - Typing indicator from other users
- `new-message` - New message received
- `message-edited` - Message edited
- `message-deleted` - Message deleted

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/jibber` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Logging level | `info` |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
