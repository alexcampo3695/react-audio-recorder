import express from 'express';
import { registerUser, authUser, forgotPassword, resetPassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/forgot_password', forgotPassword);
router.post('/reset_password/:token', resetPassword);


export default router;
