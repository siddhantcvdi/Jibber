import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger';
import { ResponseUtil } from '@/utils/response';

export interface ErrorWithStatus extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'MongoError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  ResponseUtil.error(
    res,
    message,
    process.env.NODE_ENV === 'development' ? err.stack : undefined,
    statusCode
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
};
