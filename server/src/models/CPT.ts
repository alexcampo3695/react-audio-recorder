import { Schema, model, Document } from 'mongoose';

interface CPT extends Document {
    fileId: string;
    code: string;
    description: string;
    status: boolean;
    patientId: string;
    createdAt: Date;
    updatedAt: Date;
}

const CPTSchema = new Schema<CPT>({
    fileId: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: false },
    patientId: { type: String, required: true, ref: 'Patient' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const CPT = model<CPT>('CPT', CPTSchema);

export default CPT;
