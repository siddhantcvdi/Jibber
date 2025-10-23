import {Router} from 'express';
import authMiddleware from '@/middlewares/auth.middleware';
import {
  registerStart,
  registerFinish,
  loginStart,
  loginFinish,
  whoami,
  getNewRefreshToken,
  logout
} from '@/controllers/auth.controller';

const router = Router();

router.route('/register-start').post(registerStart);
router.route('/register-finish').post(registerFinish);
router.route('/login-start').post(loginStart);
router.route('/login-finish').post(loginFinish);
router.route('/me').get(authMiddleware, whoami);
router.route('/refresh').post(getNewRefreshToken);
router.route('/logout').post(authMiddleware, logout);

export default router;