import { Router } from 'express';
import { getTranscriptions, getTranscriptionById, getTranscriptionByFileID } from '../controllers/transcriptionController';
import { getClincalNotesByFileID } from '../controllers/clinicalNotesController';

const router = Router();

// router.get('/', getClinicalNotes); // Gets all transcriptions
// router.get('/:clinicalNoteId', getClincalNotesById); // Gets by transcriptionId
router.get('/file/:fileID', getClincalNotesByFileID); // Gets by fileID
// router.get('/file/:patientID', getClinicalByPatientId); // Gets by patientID

export default router;
