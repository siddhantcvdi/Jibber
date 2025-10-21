import { Response } from 'express';
import { ApiResponse } from '@/types';

export class ResponseUtil {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    error?: any,
    statusCode: number = 500
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string, error?: any): Response {
    return this.error(res, message, error, 400);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized'
  ): Response {
    return this.error(res, message, null, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, null, 403);
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): Response {
    return this.error(res, message, null, 404);
  }

  static conflict(res: Response, message: string, error?: any): Response {
    return this.error(res, message, error, 409);
  }

  static validationError(res: Response, errors: any[]): Response {
    return this.error(res, 'Validation failed', { errors }, 422);
  }
}
