import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import ICD10 from '../models/ICD10';
import CPT from '../models/CPT';

export async function getCPTs(req: Request, res: Response) {
    try {
        const cpts = await CPT.find();
        res.json(cpts);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve cpts", error });
    }
}

export async function getCPTsByFile(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const cpts = await CPT.find({ fileId: fileID });
        if (!cpts) {
            return res.status(404).json({ message: "Cpt's not found" });
        }
        res.json(cpts);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve Cpts", error });
    }
}

export async function updateCPTsStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updateCpt = await CPT.findByIdAndUpdate(id, {status}, {new: true});
        if (!updateCpt) {
            return res.status(404).json({ message: "cpt not found" });
        }
        res.json(updateCpt);
    } catch (error) {
        res.status(500).json({ message: "Failed to update cpt status", error });
    }
};