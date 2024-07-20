import { Schema, model, Document } from 'mongoose';
import { CPTCodes } from '../types/CPTCodes';

interface CPTCodesDocument extends CPTCodes, Document {}

const CPTCodesSchema = new Schema<CPTCodesDocument>({
    Code: { type: String, required: true, unique: true },
    Description: { type: String, required: true }
}, { collection: 'cptCodes' });

const CPTCodesModel = model<CPTCodesDocument>('CPTCode', CPTCodesSchema);

export default CPTCodesModel;