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
    for (const medication of medications) {
        const newMedication = new MedicationModel({
            patientId: patientId,
            fileId: fileId,
            drugCode: medication.drugCode,
            drugName: medication.drugName,
            dosage: medication.dosage,
            frequency: medication.frequency,
            fillSupply: medication.fillSupply,
            methodOfIngestion: medication.methodOfIngestion,
            status: medication.status,
            startDate: new Date(medication.startDate),
            endDate: medication.endDate ? new Date(medication.endDate) : undefined,
        });
        await newMedication.save();
    }
}
