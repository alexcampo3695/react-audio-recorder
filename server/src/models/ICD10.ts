import mongoose, { Document, Schema } from 'mongoose';

interface ICD10Code extends Document {
    code: string;
    description: string;
}

const ICD10CodeSchema: Schema = new Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'File' },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ICD10CodeModel = mongoose.model<ICD10Code>('ICD10Code', ICD10CodeSchema);

export default ICD10CodeModel;