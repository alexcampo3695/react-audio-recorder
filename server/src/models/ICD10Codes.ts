import { Schema, model, Document } from 'mongoose';
import { ICD10Codes } from '../types/ICD10Codes';

interface ICD10CodesDocument extends ICD10Codes, Document {}

const ICD10CodesSchema = new Schema<ICD10CodesDocument>({
    Code: { type: String, required: true, unique: true },
    Description: { type: String, required: true }
}, { collection: 'icd10Codes' });

const ICD10CodesModel = model<ICD10CodesDocument>('ICD10Code', ICD10CodesSchema);

export default ICD10CodesModel;