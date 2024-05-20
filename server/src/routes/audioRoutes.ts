import { Router } from 'express';
import { uploadRecording, getUploads, getUploadById, getFileData } from '../controllers/audioController';
import multer from 'multer';
import { storage } from '../utils/gridFsUtils';

const router = Router();
const upload = multer({ storage }).single('recording');

router.post('/upload', upload, uploadRecording); //posts a new upload
router.get('/uploads_data/:fileID', getFileData); //this gets audio file data
router.get('/:fileID', getUploadById); //this gets audio blob
router.get('/', getUploads); // gets all uploads

export default router;
