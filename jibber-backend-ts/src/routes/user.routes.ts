import { Router } from 'express';
import authMiddleware from '@/middlewares/auth.middleware';
import { findUser, updateImage } from '@/controllers/user.controller';
const router = Router();

router.route('/getUsers').get(authMiddleware, findUser);
router.route('/updateProfilePhoto').post(authMiddleware, updateImage);

export default router;

