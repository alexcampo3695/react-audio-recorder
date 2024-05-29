
import { config } from 'dotenv';
config();

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Patients from "./models/Patient";
import Transcription from "./models/Transcription";
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import methodOverride from 'method-override';
import fs from 'fs';
import Uploads from './models/Recordings';
import { MongoClient, Db, GridFSBucket, ObjectId } from 'mongodb';  // Ensure correct import
import OpenAI from "openai";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

let gfs;
let db: Db;
const conn = mongoose.createConnection(process.env.MONGO_URL!);
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    db = conn.db as unknown as Db;  // Ensure correct type
    console.log("GridFS initialized");  // Log when GridFS is initialized
});

// Configure the storage for GridFS
const storage = new GridFsStorage({
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    url: process.env.MONGO_URL!,
    file: (req: Request, file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                crypto.randomBytes(16, (err, buf: Buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const patientData = req.body.patientData ? JSON.parse(req.body.patientData) : null;

                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads',
                        metadata: patientData
                    }
                    resolve(fileInfo);
                });
            });
        });
    }
});

// Set up the multer upload middleware
const upload = multer({ storage }).single('recording');

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.get("/uploads", async (req: Request, res: Response) => {
    try {
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        const files = await bucket.find().limit(100).toArray();
        if (!files || files.length === 0) {
            return res.status(404).send('No files found');
        }
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve files", error });
    }
});

app.get('/upload/:fileID', async (req: Request, res: Response) => {
    try {
        const fileID = new ObjectId(req.params.fileID);
        
        const bucket = new GridFSBucket(db, {
            bucketName: 'uploads'
        });

        const downloadStream = bucket.openDownloadStream(fileID);

        res.set('content-type', 'audio/webm');
        res.set('accept-ranges', 'bytes');

        downloadStream.on('data', (chunk: Buffer) => {
            res.write(chunk);
        });

        downloadStream.on('error', () => {
            res.status(404).send('File not found');
        });

        downloadStream.on('end', () => {
            res.end();
        });
    } catch (err) {
        console.error('Error converting file ID:', err);
        res.status(400).send('Invalid file ID');
    }
});

app.post('/upload', upload, (req: Request, res: Response) => {
    console.log("Received upload request");  // Log when request is received
    console.log("Request body:", req.body);  // Log request body

    const recording = req.file;
    if (!recording) {
        console.log("No recording file uploaded");  // Log when no recording is uploaded
        return res.status(400).send('No recording file uploaded');
    }

    if (!req.body.patientData) {
        console.log("No patient data provided");  // Log when no patient data is provided
        return res.status(400).send('No patient data provided');
    }

    let patientData = null;
    try {
        patientData = JSON.parse(req.body.patientData);  // Parse patient data
        console.log("Parsed patient data:", patientData);  // Log parsed patient data
    } catch (e) {
        console.error("Error parsing patientData:", e);
    }


    let transcription = null;
    if (req.body.transcription) {
        transcription = req.body.transcription;
    }

    // Update metadata after file upload
    const updateMetaData = async () => {
        try {
            if (!conn.db) {
                throw new Error("Database connection is not established.");
            }
            const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
            console.log("GridFSBucket created:", bucket);  // Log for debugging

            const files = await bucket.find({ filename: recording.filename }).toArray();
            if (files.length > 0) {
                const file = files[0];
                await conn.db.collection('uploads.files').updateOne(
                    { _id: file._id },
                    { $set: { metadata: patientData } }
                );
                console.log("Metadata updated successfully in the database.");

                if (transcription) {
                    const newTranscription = new Transcription({
                        patientId: new mongoose.Types.ObjectId(patientData._id),
                        recordingId: file._id,
                        transcription: transcription
                    });
                    await newTranscription.save();
                    console.log("Transcription saved successfully.");
                }
            }
        } catch (error) {
            console.error("Error updating metadata:", error);
        }
    };

    updateMetaData();

    // Log the file details and patient data
    console.log("File Details:", recording);
    console.log("Patient Data:", patientData);

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
