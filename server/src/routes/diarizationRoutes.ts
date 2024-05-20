import { Router } from 'express';
import { getDiarizations, getDiarizationByFileId } from '../controllers/diarizationController';

const router = Router();

router.get('/', getDiarizations); // Gets all transcriptions
router.get('/file/:fileID', getDiarizationByFileId); // Gets by fileID

export default router;
