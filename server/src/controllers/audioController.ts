import { Request, Response } from 'express';
import {  updateMetaData } from '../services/audioService';
import { GridFSBucket, ObjectId } from 'mongodb';
import { db } from '../utils/gridFsUtils';
import { transcribeAudio, splitAudioFile } from '../services/trascriptionService';
import Transcription from '../models/Transcription';
import fs from 'fs';
import path from 'path';


export async function uploadRecording(req: Request, res: Response) {
    const recording = req.file;
    if (!recording) {
        return res.status(400).send('No recording file uploaded');
    }

    const patientData = req.body.patientData ? JSON.parse(req.body.patientData) : null;

    try {
        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const inputPath = path.join(uploadDir, recording.filename);

        const downloadStream = bucket.openDownloadStreamByName(recording.filename);
        const writeStream = fs.createWriteStream(inputPath);
        
        downloadStream.pipe(writeStream);

        downloadStream.on('error', (error) => {
            return res.status(500).json({ message: 'Failed to download file from GridFS', error });
        });

        downloadStream.on('end', async () => {
            try {
                const chunks = await splitAudioFile({ path: inputPath, filename: recording.filename }, 60);
                let transcription = '';

                for (const chunk of chunks) {
                    try {
                        const transcriptionResponse = await transcribeAudio(chunk);
                        transcription += transcriptionResponse.text + ' ';
                    } catch (error) {
                        return res.status(500).json({ message: "Failed to transcribe audio", error });
                    }
                }

                const newTranscription = new Transcription({
                    filename: recording.filename,
                    transcription: transcription.trim(),
                    patientData
                });

                await newTranscription.save();
                await updateMetaData(recording.filename, patientData);

                res.json({
                    message: "Upload successful",
                    fileDetails: recording,
                    patientData,
                    transcription: transcription.trim()
                });
            } catch (error) {
                res.status(500).json({ message: "Failed to process recording", error });
            } finally {
                fs.unlinkSync(inputPath);
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to process recording", error });
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

function ffmpeg(inputPath: string) {
    throw new Error('Function not implemented.');
}

