import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  accessJwtExpiresIn: SignOptions['expiresIn'];
  refreshJwtExpiresIn: SignOptions['expiresIn'];
  serverSetup: string;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/jibber',
  jwtAccessSecret: process.env.ACCESS_JWT_SECRET || 'your-super-secret-jwt-key',
  jwtRefreshSecret:
    process.env.REFRESH_JWT_SECRET || 'your-super-secret-jwt-key',
  accessJwtExpiresIn: (process.env.ACCESS_JWT_EXPIRES_IN ||
    '15m') as SignOptions['expiresIn'],
  refreshJwtExpiresIn: (process.env.REFRESH_JWT_EXPIRES_IN ||
    '7d') as SignOptions['expiresIn'],
  serverSetup: process.env.SERVER_SETUP || 'server-setup',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100',
    10
  ),
};

export default config;
