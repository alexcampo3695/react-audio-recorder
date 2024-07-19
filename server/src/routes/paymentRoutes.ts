import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';
import {getPaymentMetaBySuscriber, glassfyWebHook } from '../controllers/paymentController';


const router = Router();

// router.post('/', postPayment); // post a payment
router.post('/webhook/glassfy/:userId', glassfyWebHook); // post a payment
// router.post('/proccess-purchase', processPurchase); // post a payment
router.get('/:userId', getPaymentMetaBySuscriber)

export default router;
