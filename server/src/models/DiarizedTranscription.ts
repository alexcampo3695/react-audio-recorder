import mongoose from 'mongoose';

const DiarizedTranscriptionSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'File' },
    diarization: { type: String, required: true } // Ensure 'diarization' is the correct field
}, { timestamps: true });

const DiarizedTranscription = mongoose.model('DiarizedTranscription', DiarizedTranscriptionSchema);

export default DiarizedTranscription;
