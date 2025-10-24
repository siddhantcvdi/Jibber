import { Request } from 'express';
import mongoose from 'mongoose';

export interface RefreshJwtPayload {
  _id: string;
  email: string;
}

export interface AccessJwtPayload {
  _id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: RefreshJwtPayload | AccessJwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}
