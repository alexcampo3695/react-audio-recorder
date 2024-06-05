import mongoose, { Schema, Document } from 'mongoose';
import { Medication } from '../types/Medication';

interface MedicationDocument extends Medication, Document {}

const MedicationSchema: Schema = new Schema({
    patientId: { type: String, required: true },
    fileId: { type: String, required: true },
    drugCode: { type: String, required: false }, // Made optional
    drugName: { type: String, required: true },
    dosage: { type: String, required: false },
    frequency: { type: String, required: false },
    fillSupply: { type: Number, required: false },
    methodOfIngestion: { type: String, required: false }, // e.g., orally, intravenously, etc.
    status: { type: Boolean, default: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    specialInstructions: { type: String, required: false },
}, {
    timestamps: true
});

const MedicationModel = mongoose.model<MedicationDocument>('Medication', MedicationSchema);

export default MedicationModel;
