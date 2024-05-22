import { cptGenerator } from './aiService';
import CPT from '../models/CPT';

export async function generateCPTCodes(transcription: string, fileId: any, patientId: any) {
    let cpts = [];
    for (let i = 0; i < 3; i++) {
        console.log('CPT TRY:', i + 1);
        cpts = await cptGenerator(transcription);
        if (cpts !== null) {
            break;
        }
        console.log('cpts:', cpts);
    }
    for (const cpt of cpts) {
        const existingCode = await CPT.findOne({ code: cpt.code });
        if (existingCode) {
            await CPT.updateOne(
                { code: cpt.code },
                { description: cpt.description, status: cpt.status, patientId: patientId }
            );
        } else {
            const newCPT = new CPT({
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
