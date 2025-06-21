import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getMessages } from '../controllers/messages.controller.js';
const router = Router();

router.route('/getMessages').post(authMiddleware, getMessages);

export default router;

