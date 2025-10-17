import {JwtPayload} from "jsonwebtoken";
import {Request} from "express";


export interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}
