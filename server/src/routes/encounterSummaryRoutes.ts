import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';

const router = Router();

router.get('/', getSummaries); // Gets all transcriptions
router.get('/file/:fileID', getSummaryByFileID); // Gets by fileID

export default router;
