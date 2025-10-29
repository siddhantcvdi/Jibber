import { Redis } from 'ioredis';
import logger from '@/utils/logger';
import config from '@/config';

let redis: Redis | null = null;

export const connectRedis = (): Redis => {
  if (redis) return redis;

  try {
    redis = new Redis(config.redisUrl, {
      tls: {},
    });

    redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redis.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
    });

    process.on('SIGINT', async () => {
      if (redis) {
        await redis.quit();
        logger.info('Redis connection closed through app termination');
        process.exit(0);
      }
    });

    return redis;
  } catch (err) {
    logger.error('Failed to initialize Redis:', err);
    throw err;
  }
};

export const getRedis = (): Redis => {
  if (!redis) throw new Error('Redis not connected yet');
  return redis;
};
