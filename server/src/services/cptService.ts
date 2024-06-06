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
    
    const cptPromises = cpts.map(async(cpt) => {
        const existingCode = await CPTModel.findOne({code: cpt})
        if(existingCode) {
            return CPTModel.updateOne(
                {code: cpt},
                {
                    description: cpt.description,
                    status: cpt.status,
                    patientId: cpt.patientId,
                    fileId: cpt.fileId
                }
            );
        } else {
            const newCPT = new CPTModel({
                file: fileId,
                code: cpt,
                description: cpt.description,
                status: cpt.description,
                patientId: cpt.patientId,
            })
            return newCPT.save()
        }
    });
    await Promise.all(cptPromises)
    
    const savedCPTs = await CPTModel.find({ fileId: fileId})

    return savedCPTs
}
