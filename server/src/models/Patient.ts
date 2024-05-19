import { Schema, model, Document, Types } from 'mongoose';

interface IPatient extends Document {
    PatientId: Types.ObjectId;
    FirstName: string;
    LastName: string;
    DateOfBirth: Date;
}

const PatientSchema = new Schema<IPatient>({
    PatientId: Types.ObjectId,
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
});

const Patients = model<IPatient>('Patients', PatientSchema);

export default Patients;
