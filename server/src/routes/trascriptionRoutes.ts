import { Router } from 'express';
import { getTranscriptions, getTranscriptionById, getTranscriptionByFileID, getTranscriptionByPatientId } from '../controllers/transcriptionController';

const router = Router();

router.get('/', getTranscriptions); // Gets all transcriptions
router.get('/:transcriptionId', getTranscriptionById); // Gets by transcriptionId
router.get('/file/:fileID', getTranscriptionByFileID); // Gets by fileID
router.get('/patient/:patientId', getTranscriptionByPatientId); // Gets by patientId

export default router;
