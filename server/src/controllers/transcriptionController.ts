import { Request, Response } from 'express';
import Transcription from '../models/Transcription';

export async function getTranscriptions(req: Request, res: Response) {
    try {
        const transcription = await Transcription.find();
        res.json(transcription);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transcriptions", error });
    }
}

export async function getTranscriptionById(req: Request, res: Response) {
    try {
        const transcription = await Transcription.findById(req.params.transcriptionId);
        if (!transcription) {
            return res.status(404).send('Transcription not found').json({ message: "Transcription not found" });
        }
        res.json(transcription);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transcription", error });
    }
}

export async function getTranscriptionByFile(req: Request, res: Response) {
    try {
        const transcription = await Transcription.findById(req.params.filename);
        if (!transcription) {
            return res.status(404).send('Transcription not found').json({ message: "Transcription not found" });
        }
        res.json(transcription);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transcription", error });
    }
}