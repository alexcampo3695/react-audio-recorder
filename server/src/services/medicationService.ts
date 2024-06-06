import { medicationGenerator } from './aiService';
import MedicationModel from '../models/Medication';
import { Medication } from '../types/Medication';

// Define the normalization function here
const normalizeMedicationKeys = (medication: any): Medication => {
    return {
        patientId: medication.patientId,
        fileId: medication.fileId,
        drugCode: medication.drugCode || medication.DrugCode,
        drugName: medication.drugName || medication.DrugName,
        dosage: medication.dosage || medication.Dosage,
        frequency: medication.frequency || medication.Frequency,
        fillSupply: medication.fillSupply || medication.FillSupply,
        methodOfIngestion: medication.methodOfIngestion || medication.MethodOfIngestion,
        startDate: medication.startDate || medication.StartDate,
        endDate: medication.endDate || medication.EndDate,
        specialInstructions: medication.specialInstructions || medication.SpecialInstructions,
        status: medication.status || medication.Status
    };
};

export async function generateMedications(transcription: string, fileId: string, patientId: string) {
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
        const normalizedMedication = normalizeMedicationKeys(medication);

        // Set the patientId and fileId on the normalized medication object
        normalizedMedication.patientId = patientId;
        normalizedMedication.fileId = fileId;

        if (!normalizedMedication.drugName) {
            console.error('Medication validation failed: drugName is required');
            continue; // Skip this medication
        }

        const newMedication = new MedicationModel(normalizedMedication);
        await newMedication.save();
    }
}
