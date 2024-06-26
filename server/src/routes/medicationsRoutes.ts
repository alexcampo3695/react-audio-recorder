import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';
import { updateIcd10Status, getICD10sByFile, getIcd10s } from '../controllers/icd10Controller';
import { getMedications, getMedicationsByFile, updateMedicationStatus } from '../controllers/medicationsController';

const router = Router();

router.get('/', getMedications); // Gets all medications
router.get('/file/:fileID', getMedicationsByFile); // Gets by fileID
router.patch('/update/:id', updateMedicationStatus); //Patches by medication via id

export default router;
