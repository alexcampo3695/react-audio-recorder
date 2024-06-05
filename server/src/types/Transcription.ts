// src/types/Transcription.ts
import { Document, ObjectId } from 'mongoose';

export interface Transcription extends Document {
    filename: string;
    transcription: string;
    patientData?: any; // Refine this type if you know the structure
    fileId: ObjectId;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}
