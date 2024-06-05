// src/models/ICD10.ts
import { Schema, model, Document } from 'mongoose';
import { ICD10 } from '../types/ICD10';

interface ICD10Document extends ICD10, Document {}

const ICD10Schema = new Schema<ICD10Document>({
    fileId: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: false },
    patientId: { type: String, required: true, ref: 'Patient' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ICD10Model = model<ICD10Document>('ICD10', ICD10Schema);

export default ICD10Model;
