// src/models/CPT.ts
import { Schema, model, Document } from 'mongoose';
import { CPT } from '../types/CPT';

interface CPTDocument extends CPT, Document {}

const CPTSchema = new Schema<CPTDocument>({
    fileId: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: false },
    patientId: { type: String, required: true, ref: 'Patient' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const CPTModel = model<CPTDocument>('CPT', CPTSchema);

export default CPTModel;
