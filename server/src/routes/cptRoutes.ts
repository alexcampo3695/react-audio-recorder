import { Router } from 'express';
import { getCPTs, getCPTsByFile, updateCPTsStatus } from '../controllers/cptController';

const router = Router();

router.get('/', getCPTs); // Gets all cpts
router.get('/file/:fileID', getCPTsByFile); // Gets by cpt's ileID
router.patch('/update/:id', updateCPTsStatus); //Patches cpt by id

export default router;
