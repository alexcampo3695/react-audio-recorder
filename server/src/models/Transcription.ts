// src/models/Transcription.ts
import mongoose, { Schema, model } from 'mongoose';
import { Transcription as ITranscription } from '../types/Transcription';
import { PatientData as IPatientData } from '../types/PatientData'

const PatientDataSchema = new Schema<IPatientData>({
    PatientId: { type: String, required: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    DateOfBirth: { type: String, required: true },
    CreatedBy: { type: String, required: true },
}, { _id: false });

const TranscriptionSchema = new Schema<ITranscription>({
    filename: { type: String, required: true },
    transcription: { type: String, required: true },
    patientData: { type: PatientDataSchema, required: false },
    fileId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

const TranscriptionModel = model<ITranscription>('Transcription', TranscriptionSchema);

export default TranscriptionModel;
