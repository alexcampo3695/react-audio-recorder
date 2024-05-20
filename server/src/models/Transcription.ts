import mongoose from 'mongoose';

const TranscriptionSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    transcription: { type: String, required: true },
    patientData: { type: mongoose.Schema.Types.Mixed, required: false },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Ensure this field is present
    status: { type: String, required: true }
}, { timestamps: true });

const Transcription = mongoose.model('Transcription', TranscriptionSchema);

export default Transcription;
