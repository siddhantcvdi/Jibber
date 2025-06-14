import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

const authMiddleware = (req, res, next) => {
    let token = null;
    
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '').trim();
    }

    if (!token) {
        token = req.cookies?.accessToken;
    }

    if (!token) {
        return errorResponse(res, { 
            message: "Access token missing. Please provide a valid Bearer token in Authorization header or accessToken cookie.", 
            statusCode: 401 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        let message = "Invalid or expired token";
        
        if (err.name === 'TokenExpiredError') {
            message = "Access token has expired. Please refresh your token.";
        } else if (err.name === 'JsonWebTokenError') {
            message = "Invalid access token format.";
        } 
        return errorResponse(res, { 
            message, 
            statusCode: 401 
        });
    }
};

export default authMiddleware;
