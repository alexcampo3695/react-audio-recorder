import { icd10Generator } from './aiService';
import ICD10Model from '../models/ICD10';
import { ICD10 } from '../types/ICD10'

export async function generateICD10Codes(transcription: string, fileId: any, patientId: any) {
    let icd10Codes: ICD10[] = [];
    for (let i = 0; i < 3; i++) {
        icd10Codes = await icd10Generator(transcription);
        if (icd10Codes !== null) {
            break;
        }
    }
    for (const code of icd10Codes) {
        const existingCode = await ICD10Model.findOne({ code: code.code });
        if (existingCode) {
            await ICD10Model.updateOne(
                { code: code.code },
                { description: code.description, status: code.status, patientId: patientId }
            );
        } else {
            const newICD10 = new ICD10Model({
                fileId: fileId,
                code: code.code,
                description: code.description,
                status: code.status,
                patientId: patientId,
            });
            await newICD10.save();
        }
    }
}
