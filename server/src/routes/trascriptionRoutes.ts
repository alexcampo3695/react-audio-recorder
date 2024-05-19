import { Router } from 'express';
import { getTranscriptions, getTranscriptionById } from '../controllers/transcriptionController';

const router = Router();

router.get('/', getTranscriptions);
router.get('/:transcriptionId', getTranscriptionById);

export default router;