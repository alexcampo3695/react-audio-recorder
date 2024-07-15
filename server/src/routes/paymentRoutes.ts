import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';
import {glassfyWebHook } from '../controllers/paymentController';


const router = Router();

// router.post('/', postPayment); // post a payment
router.post('/webhook/glassfy', glassfyWebHook); // post a payment

export default router;
