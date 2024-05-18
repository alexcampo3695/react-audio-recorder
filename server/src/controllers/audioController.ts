import { Request, Response } from 'express';
import { splitAudioFile, transcribeAudio, updateMetaData } from '../services/audioService';
import { GridFSBucket, ObjectId } from 'mongodb';
import { db } from '../utils/gridFsUtils';

export async function uploadRecording(req: Request, res: Response) {
    const recording = req.file;
    if (!recording) {
        return res.status(400).send('No recording file uploaded');
    }

    const patientData = req.body.patientData ? JSON.parse(req.body.patientData) : null;
    const chunks = await splitAudioFile(recording, 25 * 1024 * 1024);
    let transcription = '';

    for (const chunk of chunks) {
        try {
            const transcriptionResponse = await transcribeAudio(chunk);
            transcription += transcriptionResponse.text + ' ';
        } catch (error) {
            console.error("Error transcribing chunk:", error);
            return res.status(500).send('Error transcribing audio');
        }
    }

    await updateMetaData(recording.filename, patientData, transcription);

    res.json({
        message: "Upload successful",
        fileDetails: recording,
        patientData,
        transcription
    });
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
