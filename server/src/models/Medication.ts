import mongoose, { Schema, Document } from 'mongoose';

interface Medication extends Document {
    patientId: string;
    drugCode: string;
    drugName: string;
    dosage: string;
    frequency: string;
    fillSupply: number;
    methodOfIngestion: string;
    startDate: Date;
    endDate?: Date;
    //prescribedBy: string;
}

const MedicationSchema: Schema = new Schema({
    patientId: { type: String, required: true },
    fileId: { type: String, required: true },
    drugCode: { type: String, required: true },
    drugName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    fillSupply: { type: Number, required: true },
    methodOfIngestion: { type: String, required: true }, // e.g., orally, intravenously, etc.
    status: { type: Boolean, default: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    //prescribedBy: { type: String, required: true } // e.g., doctor's name
}, {
    timestamps: true
});

const MedicationModel = mongoose.model<Medication>('Medication', MedicationSchema);

export default MedicationModel;
