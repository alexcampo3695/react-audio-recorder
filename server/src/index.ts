import { config } from 'dotenv';
config();

import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import Deck from "./models/Deck";
import cors from 'cors';


const app = express();

const PORT = 8000;

app.use(cors());
app.use(express.json());

app.get('/get_patients', async (req : Request, res: Response) => {
    const patients = await Deck.find();
    res.json(patients);
});

app.post('/create_patient', async (req : Request, res: Response) => {
    const newPatient = new Deck({
        title: req.body.title
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




