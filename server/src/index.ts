import { config } from 'dotenv';
config();

import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import Patients from "./models/Patient";
import cors from 'cors';


const app = express();

const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/get_patients', async (req: Request, res: Response) => {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { FirstName: { $regex: RegExp(search as string, 'i') } },
            { LastName: { $regex: RegExp(search as string, 'i') } },
            // { DateOfBirth: { $regex: RegExp(search as string, 'i') } },
          ],
        }
      : {};
    
    console.log('Query object:', query);
    const patients = await Patients.find(query);
    res.json(patients);
});

app.post('/create_patient', async (req : Request, res: Response) => {
    const newPatient = new Patients({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        DateOfBirth: req.body.DateOfBirth
    });
    const createdPatient = await newPatient.save();
    res.json(createdPatient);
})

mongoose.connect(
    process.env.MONGO_URL!
).then(() => {
    console.log(`Connected to database on port: ${PORT}`);
    app.listen(PORT);
});




