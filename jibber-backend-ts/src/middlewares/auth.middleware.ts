import jwt from 'jsonwebtoken'
import {ResponseUtil} from "@/utils/response";
import {NextFunction, Response, Request} from "express";
import config from "@/config";
import {AuthRequest} from "@/types";

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    let token: string | null = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
    }

    if(!token){
        ResponseUtil.error(res, "Access token missing. Please provide a valid access token in authorization header",undefined, 401);
        return;
    }

    try{
        const decodedToken = jwt.verify(token, config.jwtSecret);
        req.user = decodedToken;
        next();
    }catch(err){
        ResponseUtil.error(res, "Token Error", err, 401);
        return;
    }
}

export default authMiddleware;