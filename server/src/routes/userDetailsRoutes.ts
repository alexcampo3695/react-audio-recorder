import express from 'express';
import { createUserDetails, getUserDetailsById, getSignatureByFileName } from '../controllers/userDetailsController';
import multer from 'multer';
import { signatureStorage } from '../utils/gridFsUtils';
import UserDetails from '../models/UserDetails';

const router = express.Router();
const upload = multer({ storage: signatureStorage });

router.post('/create', upload.single('signature'),createUserDetails);
router.get('/:userId', getUserDetailsById);
router.get('/signature/:filename', getSignatureByFileName);
router.patch('/update/:userId', upload.single('signature'), async (req, res) => {
    try {
        const { email, ...updateData } = req.body;
        const { userId } = req.params;

        console.log('useriD', userId)
        if (req.file) {
            updateData.signature = req.file.filename;
        }

        const userDetails = await UserDetails.findOneAndUpdate(
            { userId },
            { email, ...updateData },
            { new: true }
        );

        if (!userDetails) {
            return res.status(404).json({ message: "User Details not found" });
        }
        res.json(userDetails);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});



export default router;
