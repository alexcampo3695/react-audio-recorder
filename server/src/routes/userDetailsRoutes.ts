import express from 'express';
import { createUserDetails, getUserDetailsById } from '../controllers/userDetailsController';
import multer from 'multer';
import { signatureStorage } from '../utils/gridFsUtils';
import UserDetails from '../models/UserDetails';

const router = express.Router();
const upload = multer({ storage: signatureStorage });

router.post('/create', upload.single('signature'),createUserDetails);
router.get('/:userId', getUserDetailsById);
router.patch('/update', upload.single('signature'), async (req, res) => {
    try {
        const {userId, email, ...updateData} = req.body;

        ///this is sososo hideous 😔 🤠
        const userIdValue = Array.isArray(userId) ? userId[0] : userId;
        const emailValue = Array.isArray(email) ? email[0] : email;

        if (req.file) {
            updateData.signature = req.file.path;
        }
        console.log('userIdValue', userIdValue)
        console.log('emailValue', emailValue)


        const userDetails = await UserDetails.findOneAndUpdate(
            userIdValue, 
            {email: emailValue, ...updateData}, 
            {new: true}
        );

        console.log('userDetails', userDetails)

        if (!userDetails) {
            return res.status(404).json({message: "User Details not found"}) && console.log('id', userIdValue)
            
            ;
        }
        res.json(userDetails);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(req.body);
    }
})


export default router;
