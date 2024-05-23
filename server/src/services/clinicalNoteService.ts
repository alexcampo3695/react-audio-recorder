import { noteGenerator } from './aiService';
import ClinicalNote from '../models/ClinicalNote';

export async function generateClinicalNote(transcription: string, icd10codes: string, cptCodes: string, medications: string ,fileId: any, patientId: any) {
    const clinicalNote = await noteGenerator(transcription, icd10codes, cptCodes, medications);
    const newClinicalNote = new ClinicalNote({
        fileId: fileId,
        clinicalNote: clinicalNote,
        patientId: patientId,
    });
    await newClinicalNote.save();
    return newClinicalNote;
}
