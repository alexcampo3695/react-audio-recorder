import mongoose from 'mongoose';

const ClinicalNoteSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'File' },
    clinicalNote: { type: String, required: true },
    patientId: { type: String, required: true, ref: 'Patient' },
    patientData: { type: Object, required: true },  // Changed to Object
}, { timestamps: true });

const ClinicalNote = mongoose.model('ClinicalNote', ClinicalNoteSchema);

export default ClinicalNote;

