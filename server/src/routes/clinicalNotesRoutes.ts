import { Router } from 'express';
import { getTranscriptions, getTranscriptionById, getTranscriptionByFileID } from '../controllers/transcriptionController';
import { getClincalNotesByFileID,updateClinicalNote } from '../controllers/clinicalNotesController';

const router = Router();

// router.get('/', getClinicalNotes); // Gets all transcriptions
// router.get('/:clinicalNoteId', getClincalNotesById); // Gets by transcriptionId
router.get('/file/:fileID', getClincalNotesByFileID); // Gets by fileID
// router.get('/file/:patientID', getClinicalByPatientId); // Gets by patientID
router.patch('/update/:id', updateClinicalNote); //Patches by id

export default router;



