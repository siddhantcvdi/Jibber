import { Router } from 'express';
import authMiddleware from '@/middlewares/auth.middleware';
import {
  createChat,
  getAllChatsOfUser,
  deleteChat,
} from '@/controllers/chat.controller';
const router = Router();

router.route('/createChat').post(authMiddleware, createChat);
router.route('/getAllChatsOfUser').get(authMiddleware, getAllChatsOfUser);
router.route('/:chatId').delete(authMiddleware, deleteChat);

export default router;

