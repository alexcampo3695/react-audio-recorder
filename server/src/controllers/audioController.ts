import { Request, Response } from 'express';
import {  updateMetaData } from '../services/audioService';
import { GridFSBucket, ObjectId } from 'mongodb';
import { db } from '../utils/gridFsUtils';
import { transcribeAudio, splitAudioFile, generateTranscription } from '../services/trascriptionService';
import Transcription from '../models/Transcription';
import fs from 'fs';
import path from 'path';
import { cptGenerator, diariazeTranscription, icd10Generator, medicationGenerator, summarizeTranscription } from '../services/aiService';
import Summary from '../models/EncounterSummary';
import EncounterSummary from '../models/EncounterSummary';
import DiarizedTranscription from '../models/DiarizedTranscription';
import ICD10 from '../models/ICD10';
import ICD10CodeModel from '../models/ICD10';
import Medication from '../models/Medication';
import MedicationModel from '../models/Medication';
import CPT from '../models/CPT';
import { generateSummary } from '../services/summaryService';
import { generateDiarization } from '../services/diarizationService';
import { generateICD10Codes } from '../services/icd10Service';
import { generateMedications } from '../services/medicationService';
import { generateCPTCodes } from '../services/cptService';
import { generateClinicalNote } from '../services/clinicalNoteService';
import UserDetails from '../models/UserDetails';



export async function uploadRecording(req: Request, res: Response) {
    const recording = req.file;
    if (!recording) {
        return res.status(400).send('No recording file uploaded');
    }

    const patientData = req.body.patientData ? JSON.parse(req.body.patientData) : null;
    const patientId = patientData ? patientData.PatientId : null;

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
        processRecording(fileId, patientId,patientData);
    } catch (error) {
        console.error('Error uploading recording:', error);
        res.status(500).json({ message: "Failed to process recording", error });
    }
}

async function processRecording(fileId: any, patientId: any,patientData: any) {
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
            const transcription = await generateTranscription(inputPath, recording, fileId);
            await generateSummary(transcription, fileId, patientId);
            await generateDiarization(transcription, fileId, patientId);
            await generateICD10Codes(transcription, fileId, patientId);
            await generateMedications(transcription, fileId, patientId);
            await generateCPTCodes(transcription, fileId, patientId);

            // query icd10, cppt and medications
            const icd10Codes = await ICD10.find({ fileId: fileId });
            const cptCodes = await CPT.find({ fileId: fileId });
            const medications = await Medication.find({ fileId: fileId });
            const userdetails = await UserDetails.find({}) // need to get the user details

            // conversionss
            const icdCodesString = JSON.stringify(icd10Codes);
            const cptCodesString = JSON.stringify(cptCodes);
            const medicationsString = JSON.stringify(medications);

            await generateClinicalNote(
                transcription,
                icdCodesString,
                cptCodesString,
                medicationsString,
                fileId,
                patientData,
                patientId
            );

        
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


