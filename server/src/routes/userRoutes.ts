import express from 'express';
import { registerUser, authUser, forgotPassword, resetPassword, verifyTwoFactorCode, updateUserStatus } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/forgot_password', forgotPassword);
router.post('/reset_password/:token', resetPassword);
router.post('/verify_2fa', verifyTwoFactorCode);
router.patch('/status', updateUserStatus)

export default router;
