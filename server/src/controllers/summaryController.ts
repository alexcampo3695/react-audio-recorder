import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import EncounterSummary from '../models/EncounterSummary';

export async function getSummaries(req: Request, res: Response) {
    try {
        const summary = await EncounterSummary.find();
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve summary", error });
    }
}

export async function getSummaryByFileID(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const summary = await EncounterSummary.findOne({ fileId: fileID });
        if (!summary) {
            return res.status(404).json({ message: "Summary not found" });
        }
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve summary", error });
    }
}