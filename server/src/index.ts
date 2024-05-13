import { config } from 'dotenv';
config();

import express, {NextFunction, Request, Response} from 'express';
const bodyParser = require('body-parser');
import mongoose from 'mongoose';
import Patients from "./models/Patient";
import cors from 'cors';
import path from 'path';
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
import fs from 'fs';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // For handling 'application/x-www-form-urlencoded'
app.use(methodOverride('_method'));

let gfs;
const conn = mongoose.createConnection(process.env.MONGO_URL!);
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: process.env.MONGO_URL!,
    file: (req: Request, file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {

                crypto.randomBytes(16, (err:Error, buf:Buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const patientData = req.body.patientData;
                    resolve({
                        filename: filename,
                        bucketName: 'uploads',
                        metadata: patientData
                    });
                });
            });
        });
    }
});

const upload = multer({ storage }).fields([
    { name: 'recording', maxCount: 1 },
    { name: 'patientData', maxCount: 1 }
]);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.post('/upload', upload, (req: Request, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || !files.recording || files.recording.length === 0) {
        return res.status(400).send('No recording file uploaded');
    }
    const recording = files.recording[0];
    if (!req.body.patientData) {
        return res.status(400).send('No patient data provided');
    }
    const patientData = JSON.parse(req.body.patientData);
    res.json({
        message: "Upload successful",
        fileDetails: recording,
        patientData
    });
});



app.get('/get_patients', async (req: Request, res: Response) => {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { FirstName: { $regex: RegExp(search as string, 'i') } },
            { LastName: { $regex: RegExp(search as string, 'i') } }
          ],
        }
      : {};
    
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
});

mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log(`Connected to database on port: ${PORT}`);
    app.listen(PORT);
});