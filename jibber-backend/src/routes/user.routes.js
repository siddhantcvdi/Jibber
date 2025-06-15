import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { findUsers } from '../controllers/user.controller.js';
const router = Router();

router.route('/getUsers').get(authMiddleware, findUsers);

export default router;

