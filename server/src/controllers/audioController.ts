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
import { generateTasks } from '../services/taskService';



export async function uploadRecording(req: Request, res: Response) {
    const recording = req.file;
    if (!recording) {
        return res.status(400).send('No recording file uploaded');
    }

    const patientData = req.body.patientData ? JSON.parse(req.body.patientData) : null;
    const patientId = patientData ? patientData.PatientId : null;
    const userId = patientData ? patientData.CreatedBy : null;

    console.log('userId:', userId);

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
        processRecording(fileId, patientId,patientData, userId);
    } catch (error) {
        console.error('Error uploading recording:', error);
        res.status(500).json({ message: "Failed to process recording", error });
    }
}

async function processRecording(fileId: any, patientId: any,patientData: any, userId: any) {
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
                console.log('Transcription generated');

                const summaryPromise = generateSummary(transcription, fileId, patientId);
                const diarizationPromise = generateDiarization(transcription, fileId, patientId);
                const icd10CodesPromise = generateICD10Codes(transcription, fileId, patientId);
                const medicationsPromise = generateMedications(transcription, fileId, patientId);
                const cptCodesPromise = generateCPTCodes(transcription, fileId, patientId);
                const tasksPromise = generateTasks(transcription, fileId, patientId, userId);
                const userDetailsPromise = UserDetails.find({ userId: patientData.UserId });

                // Wait for all promises to resolve
                const [summary, diarization, icd10Codes, medications, cptCodes, tasks, userDetails] = await Promise.all([
                    summaryPromise,
                    diarizationPromise,
                    icd10CodesPromise,
                    medicationsPromise,
                    cptCodesPromise,
                    tasksPromise,
                    userDetailsPromise
                ]);

                // Convert to strings for clinical note generation
                const icdCodesString = JSON.stringify(icd10Codes);
                const cptCodesString = JSON.stringify(cptCodes);
                const medicationsString = JSON.stringify(medications);
                const tasksString = JSON.stringify(tasks);
                const userDetailsString = JSON.stringify(userDetails);

                console.log('medication string', medicationsString);
                console.log('userDetails', userDetailsString);
                console.log('tasks:', tasksString);

                const clinicalNote = await generateClinicalNote(
                    transcription,
                    icdCodesString,
                    cptCodesString,
                    medicationsString,
                    fileId,
                    patientData,
                    patientId,
                    userDetailsString
                );

                console.log('Clinical note generated', clinicalNote);

                // Append metadata to audio/upload file
                await updateMetaData(recording.filename, patientData);

                // Update the status to 'complete'
                await Transcription.updateOne(
                    { fileId: fileId },
                    { $set: { status: 'complete' } }
                );
                
                console.log('Transcription processing complete');
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


