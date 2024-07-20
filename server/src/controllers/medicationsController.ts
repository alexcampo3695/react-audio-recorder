import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import ICD10 from '../models/ICD10';
import MedicationModel from '../models/Medication';
import ValidMedicationsModel from '../models/ValidMedications';

export async function getMedications(req: Request, res: Response) {
    try {
        const medications = await MedicationModel.find();
        res.json(medications);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve medications", error });
    }
}

export async function getMedicationsByFile(req: Request, res: Response) {
    try {
        const fileID = new ObjectId(req.params.fileID);
        const medications = await MedicationModel.find({ fileId: fileID });
        if (!medications) {
            return res.status(404).json({ message: "medications's not found" });
        }
        res.json(medications);
    } catch (error) {
        console.error('Error retrieving meds:', error);
        res.status(500).json({ message: "Failed to retrieve medications", error });
    }
}

export async function updateMedicationStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updateMedication = await MedicationModel.findByIdAndUpdate(id, {status}, {new: true});
        if (!updateMedication) {
            return res.status(404).json({ message: "Medication not found" });
        }
        res.json(updateMedication);
    } catch (error) {
        res.status(500).json({ message: "Failed to update Medication status", error });
    }
};

export async function getMedicationsByPatient(req: Request, res: Response) {
    try {
        const { patientId } = req.params;
        const medications = await MedicationModel.find({ patientId: patientId });
        if (!medications) {
            return res.status(404).json({ message: "medications's not found" });
        }
        res.json(medications);
    } catch (error) {
        console.error('Error retrieving meds:', error);
        res.status(500).json({ message: "Failed to retrieve medications", error });
    }
}

export async function queryValidMedications(req: Request, res: Response) {
    const search = req.query.search as string | undefined;

    try {
        let query = {};

        if (search) {
            const regex = new RegExp(search, 'i');

            query = {
                $or: [
                    { Form: regex },
                    { Strength: regex },
                    { DrugName: regex }
                ],
            };
        }

        const allValidMedications = await ValidMedicationsModel.find(query);

        res.json(allValidMedications);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve valid medications", error });
    }
}