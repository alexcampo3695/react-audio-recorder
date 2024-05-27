import express from 'express';
import { createUserDetails } from '../controllers/userDetailsController';

const router = express.Router();

router.post('/create', createUserDetails);


export default router;
