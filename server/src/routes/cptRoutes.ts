import { Router } from 'express';
import { getCPTs, getCPTsByFile, queryValidCPTCodes, updateCPTsStatus } from '../controllers/cptController';

const router = Router();

router.get('/', getCPTs); // Gets all cpts
router.get('/file/:fileID', getCPTsByFile); // Gets by cpt's ileID
router.patch('/update/:id', updateCPTsStatus); //Patches cpt by id
router.get('/getAllExistingCPTs', queryValidCPTCodes); // Gets by cpt's ileID

export default router;
