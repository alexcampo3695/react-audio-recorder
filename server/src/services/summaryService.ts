import { summarizeTranscription } from './aiService';
import EncounterSummary from '../models/EncounterSummary';

export async function generateSummary(transcription: string, fileId: any, patientId: any) {
    const summary = await summarizeTranscription(transcription);
    const newSummary = new EncounterSummary({
        fileId: fileId,
        summary: summary,
        patientId: patientId,
    });
    await newSummary.save();
    return newSummary;
}
