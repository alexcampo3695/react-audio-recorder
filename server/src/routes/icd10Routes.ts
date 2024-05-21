import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';
import { updateIcd10Status, getICD10sByFile, getIcd10s } from '../controllers/icd10Controller';

const router = Router();

router.get('/', getIcd10s); // Gets all transcriptions
router.get('/file/:fileID', getICD10sByFile); // Gets by fileID
router.patch('/update/:id', updateIcd10Status); //Patches by id

export default router;
