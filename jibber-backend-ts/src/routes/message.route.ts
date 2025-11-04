import { Router } from 'express';
import authMiddleware from '@/middlewares/auth.middleware';
import { getMessages } from '@/controllers/message.controller';
const router = Router();

router.route('/:chatId').get(authMiddleware, getMessages);

export default router;

