import { errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  logger.error(`${statusCode} - ${err.message}`);
  return errorResponse(res, {
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
