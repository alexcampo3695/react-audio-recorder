import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import ICD10 from '../models/ICD10';

export async function getIcd10s(req: Request, res: Response) {
    try {
        const icd10s = await ICD10.find();
        res.json(icd10s);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve icd10s", error });
    }
}

export async function getICD10sByFile(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const icd10s = await ICD10.find({ fileId: fileID });
        if (!icd10s) {
            return res.status(404).json({ message: "ICD10's not found" });
        }
        res.json(icd10s);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve icd10s", error });
    }
}

export async function updateIcd10Status(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updateIcd10 = await ICD10.findByIdAndUpdate(id, {status}, {new: true});
        if (!updateIcd10) {
            return res.status(404).json({ message: "ICD10 not found" });
        }
        res.json(updateIcd10);
    } catch (error) {
        res.status(500).json({ message: "Failed to update icd10 status", error });
    }
};

export async function getICD10sByPatient(req: Request, res: Response) {
    try {
        const { patientId } = req.params;
        const icd10s = await ICD10.find({ patientId: patientId });
        if (!icd10s) {
            return res.status(404).json({ message: "ICD10's not found" });
        }
        res.json(icd10s);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve icd10s", error });
    }
}