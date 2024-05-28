import express from 'express';
import { createUserDetails, getUserDetailsById } from '../controllers/userDetailsController';

const router = express.Router();

router.post('/create', createUserDetails);
router.get('/:userId', getUserDetailsById);


export default router;
