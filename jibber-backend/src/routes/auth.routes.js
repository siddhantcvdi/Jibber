import {Router} from 'express'
import {
    loginFinish,
    loginStart,
    refresh,
    registerFinish,
    registerStart,
    whoami,
    logout
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register-start').post(registerStart)
router.route('/register-finish').post(registerFinish)
router.route('/login-start').post(loginStart)
router.route('/login-finish').post(loginFinish)
router.route('/whoami').post(authMiddleware, whoami)
router.route('/me').get(authMiddleware, whoami)
router.route('/refresh').post(refresh)
router.route('/logout').post(authMiddleware, logout)

export default router;``