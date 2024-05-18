import { Router } from 'express';
import { uploadRecording, getUploads, getUploadById } from '../controllers/audioController';
import multer from 'multer';
import { storage } from '../utils/gridFsUtils';

const router = Router();
const upload = multer({ storage }).single('recording');

router.post('/upload', upload, uploadRecording);
router.get('/', getUploads);
router.get('/:fileID', getUploadById);

export default router;
