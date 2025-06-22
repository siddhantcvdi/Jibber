import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createChat, getAllChatsOfUser } from '../controllers/chat.controller.js';
const router = Router();

router.route('/createChat').post(authMiddleware, createChat);
router.route('/getAllChatsOfUser').get(authMiddleware, getAllChatsOfUser);

export default router;

