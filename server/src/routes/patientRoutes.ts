import { Router } from 'express';
import { createPatient, getPatients } from '../controllers/patientController';

const router = Router();

router.post('/create', createPatient);
router.get('/', getPatients);

export default router;
