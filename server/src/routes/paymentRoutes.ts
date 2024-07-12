import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';
import { postPayment } from '../controllers/paymentController';

const router = Router();

router.post('/', postPayment); // post a payment

export default router;
