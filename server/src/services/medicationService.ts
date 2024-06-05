import { medicationGenerator } from './aiService';
import MedicationModel from '../models/Medication';
import { Medication } from '../types/Medication';


export async function generateMedications(transcription: string, fileId: any, patientId: any) {
    let medications: Medication[] = [];
    for (let i = 0; i < 3; i++) {
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
            drugCode: medication.drugCode || undefined,
            drugName: medication.drugName,
            dosage: medication.dosage,
            frequency: medication.frequency,
            fillSupply: medication.fillSupply,
            methodOfIngestion: medication.methodOfIngestion,
            status: medication.status,
            startDate: medication.startDate ? new Date(medication.startDate) : undefined,
            endDate: medication.endDate ? new Date(medication.endDate) : undefined,
            specialInstructions: medication.specialInstructions, // Ensure this is added
        });
        await newMedication.save();
    }
    
}
