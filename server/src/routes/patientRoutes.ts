import { Router } from 'express';
import { createPatient, getPatients } from '../controllers/patientController';

const router = Router();

router.post('/create', (req, res, next) => {
    console.log('POST /api/patients/create called');
    next();
}, createPatient);

router.get('/', (req, res, next) => {
    console.log('GET /api/patients called');
    next();
}, getPatients);

export default router;
