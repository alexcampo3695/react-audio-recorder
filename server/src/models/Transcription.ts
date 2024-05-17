import { Schema, model, Document } from 'mongoose';

interface ITranscription extends Document {
    patientId: string;
    recordingId: string;
    transcription: string;
}

const TranscriptionSchema: Schema = new Schema<ITranscription>({
    patientId: { type: String, required: true },
    recordingId: { type: String, required: true },
    transcription: { type: String, required: true },
    // Add other fields as necessary
});

const Transcription = model<ITranscription>('Transcription', TranscriptionSchema);

export default Transcription;
