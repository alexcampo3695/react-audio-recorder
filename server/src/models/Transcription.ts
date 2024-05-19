import mongoose from 'mongoose';

const TranscriptionSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    transcription: { type: String, required: true },
    patientData: {
        FirstName: { type: String, required: true },
        LastName: { type: String, required: true },
        DateOfBirth: { type: Date, required: true }
    }
}, { timestamps: true });

const Transcription = mongoose.model('Transcription', TranscriptionSchema);

export default Transcription;