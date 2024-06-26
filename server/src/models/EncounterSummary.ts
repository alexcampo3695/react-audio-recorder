import mongoose from 'mongoose';

const EncounterSummarySchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'File' },
    // transcriptionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Transcription' },
    summary: { type: String, required: true },
    patientId: { type: String, required: true, ref: 'Patient' }
}, { timestamps: false });

const EncounterSummary = mongoose.model('Summary', EncounterSummarySchema);

export default EncounterSummary;