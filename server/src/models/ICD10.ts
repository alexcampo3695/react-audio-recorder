import { Schema, model, Document } from 'mongoose';

interface IICD10 extends Document {
    fileId: string;
    code: string;
    description: string;
    status: boolean;
    patientId: string;
    createdAt: Date;
    updatedAt: Date;
}

const ICD10Schema = new Schema<IICD10>({
    fileId: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: false },
    patientId: { type: String, required: true, ref: 'Patient' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ICD10 = model<IICD10>('ICD10', ICD10Schema);

export default ICD10;
