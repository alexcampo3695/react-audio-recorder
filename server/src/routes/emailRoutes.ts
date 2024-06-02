import express from 'express';
import multer from 'multer';
import { sendPdfEmail } from '../controllers/emailController';

const upload = multer();
const router = express.Router();

router.post('/send_pdf_email', upload.single('pdf'), sendPdfEmail);

export default router;
