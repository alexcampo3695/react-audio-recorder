import { Schema, model, Document, Types } from 'mongoose';

interface IPatient extends Document {
    PatientId: string;
    FirstName: string;
    LastName: string;
    DateOfBirth: Date;
    CreatedBy: string;
}

const PatientSchema = new Schema<IPatient>({
    PatientId: { type: String, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    CreatedBy: {type: String, required: true},
});

const Patients = model<IPatient>('Patients', PatientSchema);

export default Patients;
