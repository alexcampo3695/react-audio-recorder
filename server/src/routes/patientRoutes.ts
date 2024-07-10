import { Router } from 'express';
import { createPatient, getPatients, getPatientsByCreatedUser, getPatientsById,  } from '../controllers/patientController';

const router = Router();

router.post('/create', (req, res, next) => {
    console.log('POST /api/patients/create called');
    next();
}, createPatient);

router.get('/', (req, res, next) => {
    console.log('GET /api/patients called');
    next();
}, getPatients);

router.post('/by_creatorId', (req, res, next) => {
    next();
}, getPatientsByCreatedUser);

router.get('/:patientId', getPatientsById);

export default router;
