import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import ICD10 from '../models/ICD10';
import ICD10Codes from '../models/ICD10Codes';

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

export async function queryValidIcd10Codes(req: Request, res: Response) {
    const search = req.query.search as string | undefined;

    try {
        let query = {};

        if (search) {
            const regex = new RegExp(search, 'i');

            query = {
                $or: [
                    { Code: { $regex: regex } },
                    { Description: { $regex: regex } }
                ],
            }
        }

        const allValidIcd10s = await ICD10Codes.find(query);
        
        res.json(allValidIcd10s);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve icd10s", error });
    }
}

export async function savePatientIcd10Codes(req: Request, res: Response) {
    try {
        const { icd10Codes, patientId } = req.body;

        if (!icd10Codes || !patientId || !Array.isArray(icd10Codes)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const savedCodes = await Promise.all(icd10Codes.map(async (code) => {
            const newIcd10 = new ICD10({
                fileId: code.fileId || 'N/A',
                code: code.code,
                description: code.description,
                status: code.status,
                patientId: patientId,
            })

            return await newIcd10.save();
        }))

        res.status(201).json({
            message: "ICD10 codes saved successfully",
            savedCodes: savedCodes
        });
    } catch(e) {
        res.status(500).json({ message: "Failed to save icd10 codes", error: e });
    }
}
