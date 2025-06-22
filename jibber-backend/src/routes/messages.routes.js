import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getMessages } from '../controllers/messages.controller.js';
const router = Router();

router.route('/:chatId').get(authMiddleware, getMessages);

export default router;

