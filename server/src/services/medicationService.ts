import { medicationGenerator } from './aiService';
import MedicationModel from '../models/Medication';

export async function generateMedications(transcription: string, fileId: any, patientId: any) {
    let medications = [];
    for (let i = 0; i < 3; i++) {
        console.log('Medication Try:', i + 1);
        medications = await medicationGenerator(transcription);
        if (medications !== null) {
            break;
        }
    }
    if (!medications) {
        return; // Return early if no medications are generated
    }
    for (const medication of medications) {
        const newMedication = new MedicationModel({
            patientId: patientId,
            fileId: fileId,
            drugCode: medication.DrugCode || undefined,
            drugName: medication.DrugName,
            dosage: medication.Dosage,
            frequency: medication.Frequency,
            fillSupply: medication.FillSupply,
            methodOfIngestion: medication.MethodOfIngestion,
            status: medication.Status,
            startDate: medication.StartDate ? new Date(medication.StartDate) : undefined,
            endDate: medication.EndDate ? new Date(medication.EndDate) : undefined,
            specialInstructions: medication.SpecialInstructions, // Ensure this is added
        });
        await newMedication.save();
    }
}
