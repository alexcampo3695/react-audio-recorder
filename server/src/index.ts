import { config } from 'dotenv';
config();

import express, { Request, Response } from 'express';
const bodyParser = require('body-parser');
import mongoose from 'mongoose';
import Patients from "./models/Patient";
import cors from 'cors';
import path from 'path';
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
import fs from 'fs';
import Uploads from './models/Recordings';
const ObjectID = require('mongodb').ObjectID;
const mongodb = require('mongodb');

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

// Configure the storage for GridFS
const storage = new GridFsStorage({
    url: process.env.MONGO_URL!,
    file: (req: Request, file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                crypto.randomBytes(16, (err: Error, buf: Buffer) => {
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
                    // resolve(fileInfo);
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

interface UploadedFile {
    _id: string;
    filename: string;
    contentType: string;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    metadata: any;
}

app.get("/uploads", async function (req: Request, res: Response) {
    try {
        const bucket = new mongodb.GridFSBucket(conn.db, { bucketName: 'uploads' });
        const file = await bucket.find().limit(100).toArray();
        if (!file || file.length === 0) {
            return res.status(404).send('No files found');
        }
        res.json(file); // Send the found file back as JSON
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve files", error });
    }
});

app.get('/upload/:fileID', async (req: Request, res: Response) => {
    try {
        const fileID = new mongoose.Types.ObjectId(req.params.fileID);

        const bucket = new mongodb.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });

        const downloadStream = bucket.openDownloadStream(fileID);

        res.set('content-type', 'audio/webm'); // Set the appropriate content-type
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
    console.log("Request body:", req.body);
    const recording = req.file;
    if (!recording) {
        return res.status(400).send('No recording file uploaded');
    }

    if (!req.body.patientData) {
        return res.status(400).send('No patient data provided');
    }

    let patientData = null;
    try {
        // Ensure patientData is correctly parsed
        patientData = JSON.parse(req.body.patientData);
    } catch (e) {
        console.error("Error parsing patientData:", e);
    }

    const updateMetaData = async () => {
        try {
            const bucket = new mongodb.GridFSBucket(conn.db, { bucketName: 'uploads' });
            const files = await bucket.find({ filename: recording.filename }).toArray();
            if (files.length > 0) {
                const file = files[0];
                await conn.db.collection('uploads.files').updateOne(
                    { _id: file._id },
                    { $set: { metadata: patientData } }
                );
                console.log("Metadata updated successfully in the database.");
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
        patientData: patientData
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

app.post('/create_patient', async (req: Request, res: Response) => {
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
