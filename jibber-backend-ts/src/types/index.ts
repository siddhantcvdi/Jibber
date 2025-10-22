import { Request } from 'express';
import mongoose from 'mongoose';

export interface RefreshJwtPayload {
  _id: string;
  email: string;
}

export interface AccessJwtPayload {
  _id: string;
}

export interface AuthRequest extends Request {
  user?: RefreshJwtPayload | AccessJwtPayload;
}

export interface UserType {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  registrationRecord: string;
  encPrivateIdKey: string;
  encPrivateSigningKey: string;
  publicIdKey: string;
  publicSigningKey: string;
  idKeyNonce: string;
  signingKeyNonce: string;
  idKeySalt: string;
  signingKeySalt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}
