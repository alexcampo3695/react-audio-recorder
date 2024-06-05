// src/models/Transcription.ts
import mongoose, { Schema, model } from 'mongoose';
import { Transcription as ITranscription } from '../types/Transcription';

const TranscriptionSchema = new Schema<ITranscription>({
    filename: { type: String, required: true },
    transcription: { type: String, required: true },
    patientData: { type: Schema.Types.Mixed, required: false },
    fileId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

const TranscriptionModel = model<ITranscription>('Transcription', TranscriptionSchema);

export default TranscriptionModel;
