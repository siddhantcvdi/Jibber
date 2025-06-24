import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { findUsers, updateImage } from '../controllers/user.controller.js';
const router = Router();

router.route('/getUsers').get(authMiddleware, findUsers);
router.route('/updateProfilePhoto').post(authMiddleware, updateImage);

export default router;

