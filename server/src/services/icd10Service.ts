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
        console.log('ICD10 Codes',icd10Codes)
    }
    
    const uniqueICD10s = Array.from(new Set(icd10Codes.map(code => code.code)))
        .map(code => {
            return icd10Codes.find(item => item.code === code)
        })
        .filter(code => code !== undefined) as ICD10[];

    const icd10Promises = uniqueICD10s.map(async(code) => {
        const existingCode = await ICD10Model.findOne({code: code.code})
        if (existingCode) {
            return ICD10Model.updateOne(
                { code: code.code},
                {
                    description: code.description,
                    status: code.status,
                    patientId: patientId,
                    fileId: fileId
                }
            );
        } else {
            const newICD10 = new ICD10Model({
                fileId: fileId,
                code: code.code,
                description: code.description,
                status: code.status,
                patientId: patientId
            });
            return newICD10.save()
        }
    });

    await Promise.all(icd10Promises);

    const savedIcd10Codes = await ICD10Model.find({ file: fileId })

    return savedIcd10Codes
}
