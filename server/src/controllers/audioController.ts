import { Request, Response } from 'express';
import {  updateMetaData } from '../services/audioService';
import { GridFSBucket, ObjectId } from 'mongodb';
import { db } from '../utils/gridFsUtils';
import { transcribeAudio, splitAudioFile } from '../services/trascriptionService';
import Transcription from '../models/Transcription';
import fs from 'fs';
import path from 'path';
import { diariazeTranscription, icd10Generator, summarizeTranscription } from '../services/aiService';
import Summary from '../models/EncounterSummary';
import EncounterSummary from '../models/EncounterSummary';
import DiarizedTranscription from '../models/DiarizedTranscription';
import ICD10 from '../models/ICD10';
import ICD10CodeModel from '../models/ICD10';



export async function uploadRecording(req: Request, res: Response) {
    const recording = req.file;
    if (!recording) {
        return res.status(400).send('No recording file uploaded');
    }

    const patientData = req.body.patientData ? JSON.parse(req.body.patientData) : null;

    try {
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        // Find the file in the database using the filename
        const fileDoc = await bucket.find({ filename: recording.filename }).toArray();
        if (fileDoc.length === 0) {
            return res.status(404).send('File not found in GridFS');
        }

        const fileId = fileDoc[0]._id;

        const newTranscription = new Transcription({
            filename: recording.filename,
            transcription: 'Processing...', // Set initial transcription status
            patientData,
            fileId: fileId, // Use the file ID from the database
            status: 'loading' // Set initial status to 'loading'
        });

        await newTranscription.save();

        res.json({
            message: "Upload successful",
            fileDetails: recording,
            patientData,
            transcription: 'Processing...',
            status: 'loading',
            fileId: fileId
        });

        // Process the recording in the background
        processRecording(fileId, patientData);
    } catch (error) {
        console.error('Error uploading recording:', error);
        res.status(500).json({ message: "Failed to process recording", error });
    }
}

async function processRecording(fileId: any, patientData: any) {
    try {
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        
        // Find the file in the database using the fileId
        const fileDoc = await bucket.find({ _id: fileId }).toArray();
        if (fileDoc.length === 0) {
            throw new Error('File not found in GridFS');
        }
        
        const recording = fileDoc[0];

        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const inputPath = path.join(uploadDir, recording.filename);
        const downloadStream = bucket.openDownloadStreamByName(recording.filename);
        const writeStream = fs.createWriteStream(inputPath);
        downloadStream.pipe(writeStream);

        downloadStream.on('end', async () => {
        try {

            //Generating Transcription
            const chunks = await splitAudioFile({ path: inputPath, filename: recording.filename }, 60);
            let transcription = '';
            for (const chunk of chunks) {
                const transcriptionResponse = await transcribeAudio(chunk);
                transcription += transcriptionResponse.text + ' ';
            }
            await Transcription.updateOne(
                { fileId: fileId },
                { $set: { transcription: transcription.trim(), status: 'complete' } }
            );

            //Generating Summary
            const summary = await summarizeTranscription(transcription.trim());
            const newSummary =  new EncounterSummary({
                fileId: fileId,
                summary: summary,
            })
            await newSummary.save();

            //Generation Diarization
            const diarization = await diariazeTranscription(transcription.trim());
            const newDiarization = new DiarizedTranscription({
                fileId: fileId,
                diarization: diarization,
            });
            await newDiarization.save();

            //Generate ICD10 Codes
            // Generate ICD10 Codes
            let maxTries = 3;
            // const icd10Codes = await icd10Generator(transcription.trim());
            let icd10Codes = [];
            for (let i = 0; i < maxTries; i++) {
                console.log('Try:', i + 1)
                icd10Codes = await icd10Generator(transcription.trim());
                if (icd10Codes !== null) {
                    break;
                }
            }
            for (const code of icd10Codes) {
                const existingCode = await ICD10.findOne({ code: code.code });
                 if (existingCode) {
                    await ICD10.updateOne(
                        {code: code.code},
                        { description: code.description, status: code.status }
                    );
                 } else {
                    const newICD10 = new ICD10({
                        fileId: fileId,
                        code: code.code,
                        description: code.description,
                        status: code.status
                    });
                    await newICD10.save();
                 }
            }
            
            //apending metaData to audio/upload file
            await updateMetaData(recording.filename, patientData);

        } catch (error) {
            console.error('Error processing recording:', error);
            await Transcription.updateOne(
                { fileId: fileId },
                { $set: { status: 'error' } }
            );
        } finally {
            fs.unlinkSync(inputPath);
        }
        });
    } catch (error) {
        console.error('Error processing recording:', error);
    }
}

export async function getUploads(req: Request, res: Response) {
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
}

export async function getUploadById(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

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
}

export async function getFileData(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        const fileDoc = await bucket.find({ _id: fileID }).toArray();

        if (fileDoc.length === 0) {
            return res.status(404).send('File not found');
        }
        res.json(fileDoc[0]);
    } catch (err) {
        console.error('Error converting file ID:', err);
        res.status(400).send('Invalid file ID');
    }
}


