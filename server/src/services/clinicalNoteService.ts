import { noteGenerator } from './aiService';
import ClinicalNote from '../models/ClinicalNote';

export async function generateClinicalNote(
    transcription: string, 
    icd10codes: string, 
    cptCodes: string, 
    medications: string,
    fileId: any, 
    patientData: object,  // Keep as object
    patientId: any,
    userDetails: string
) {
    // Convert patientData to a string
    const patientDataString = JSON.stringify(patientData);

    // Pass the stringified patientData to noteGenerator
    const clinicalNote = await noteGenerator(transcription, icd10codes, cptCodes, medications, patientDataString, userDetails);

    const newClinicalNote = new ClinicalNote({
        fileId: fileId,
        clinicalNote: clinicalNote,
        patientId: patientId,
        patientData: patientData,  // Keep as object in the database
    });

    await newClinicalNote.save();
    return newClinicalNote;
}
