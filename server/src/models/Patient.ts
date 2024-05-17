import { Schema, model, Document } from 'mongoose';

interface IPatient extends Document {
    FirstName: string;
    LastName: string;
    DateOfBirth: Date;
}

const PatientSchema = new Schema<IPatient>({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    // Add other fields as necessary
});

const Patients = model<IPatient>('Patients', PatientSchema);

export default Patients;
