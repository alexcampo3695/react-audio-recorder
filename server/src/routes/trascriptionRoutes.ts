import { Router } from 'express';
import { getTranscriptions, getTranscriptionById, getTranscriptionByFileID } from '../controllers/transcriptionController';

const router = Router();

router.get('/', getTranscriptions); // Gets all transcriptions
router.get('/:transcriptionId', getTranscriptionById); // Gets by transcriptionId
router.get('/file/:fileID', getTranscriptionByFileID); // Gets by fileID

export default router;
