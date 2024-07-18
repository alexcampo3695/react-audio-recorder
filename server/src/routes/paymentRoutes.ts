import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';
import {getPaymentMetaBySuscriber, glassfyWebHook, processPurchase } from '../controllers/paymentController';


const router = Router();

// router.post('/', postPayment); // post a payment
router.post('/webhook/glassfy', glassfyWebHook); // post a payment
router.post('/proccess-purchase', processPurchase); // post a payment
router.get('/:subscriberId', getPaymentMetaBySuscriber)

export default router;
