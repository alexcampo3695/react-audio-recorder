import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';
import { getICD10sByFile, getIcd10s } from '../controllers/icd10Controller';

const router = Router();

router.get('/', getIcd10s); // Gets all transcriptions
router.get('/file/:fileID', getICD10sByFile); // Gets by fileID

export default router;
