import { diariazeTranscription } from './aiService';
import DiarizedTranscription from '../models/DiarizedTranscription';

export async function generateDiarization(transcription: string, fileId: any, patientId: any) {
    const diarization = await diariazeTranscription(transcription);
    const newDiarization = new DiarizedTranscription({
        fileId: fileId,
        diarization: diarization,
        patientId: patientId,
    });
    await newDiarization.save();
    return newDiarization;
}
