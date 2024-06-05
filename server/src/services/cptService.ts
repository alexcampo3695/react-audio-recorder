import { cptGenerator } from './aiService';
import CPTModel from '../models/CPT';
import { CPT } from '../types/CPT'

export async function generateCPTCodes(transcription: string, fileId: any, patientId: any) {
    let cpts: CPT[] = [];
    for (let i = 0; i < 3; i++) {
        if (cpts !== null) {
            break;
        }
        console.log('cpts:', cpts);
    }
    cpts = await cptGenerator(transcription);
    for (const cpt of cpts) {
        const existingCode = await CPTModel.findOne({ code: cpt.code });
        if (existingCode) {
            await CPTModel.updateOne(
                { code: cpt.code },
                { description: cpt.description, status: cpt.status, patientId: patientId }
            );
        } else {
            const newCPT = new CPTModel({
                fileId: fileId,
                code: cpt.code,
                description: cpt.description,
                status: cpt.status,
                patientId: patientId,
            });
            await newCPT.save();
        }
    }
}
