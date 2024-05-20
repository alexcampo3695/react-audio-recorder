import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import DiarizedTranscription from '../models/DiarizedTranscription';

export async function getDiarizations(req: Request, res: Response) {
    try {
        const summary = await DiarizedTranscription.find();
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve diarization", error });
    }
}

export async function getDiarizationByFileId(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const diarization = await DiarizedTranscription.findOne({ fileId: fileID });
        if (!diarization) {
            return res.status(404).json({ message: "Diarization not found" });
        }
        res.json(diarization);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve diarization", error });
    }
}