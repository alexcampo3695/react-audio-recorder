import { Router } from 'express';
import { getSummaries, getSummaryByFileID } from '../controllers/summaryController';
import { updateIcd10Status, getICD10sByFile, getIcd10s, getICD10sByPatient, queryValidIcd10Codes, savePatientIcd10Codes } from '../controllers/icd10Controller';

const router = Router();

router.get('/', getIcd10s); // Gets all transcriptions
router.get('/file/:fileID', getICD10sByFile); // Gets by fileID
router.patch('/update/:id', updateIcd10Status); //Patches by id
router.get('/patient/:patientId', getICD10sByPatient); // Gets by patientId
router.get('/getAllExistingIcd10s', queryValidIcd10Codes); // gets ALL icd10 codes in the database
router.post('/save-icd10-codes', savePatientIcd10Codes); // gets ALL icd10 codes in the database


export default router;
