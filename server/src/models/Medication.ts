import mongoose, { Schema, Document } from 'mongoose';

interface Medication extends Document {
    patientId: string;
    fileId: string;
    drugCode?: string; // Made optional
    drugName: string;
    dosage?: string;
    frequency?: string;
    fillSupply?: number;
    methodOfIngestion?: string;
    startDate?: Date;
    endDate?: Date;
    specialInstructions?: string;
    status: boolean;
}

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

const MedicationModel = mongoose.model<Medication>('Medication', MedicationSchema);

export default MedicationModel;
