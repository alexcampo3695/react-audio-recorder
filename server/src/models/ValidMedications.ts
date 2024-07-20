import { Schema, model, Document } from 'mongoose';
import { ValidMedications } from '../types/ValidMedications';

interface ValidMedicationsDocument extends ValidMedications, Document {}

const ValidMedicationsSchema = new Schema<ValidMedicationsDocument>({
    Form: { type: String, required: true },
    Strength: { type: String, required: true },
    DrugName: { type: String, required: true }
}, { collection: 'validMedications' });

const ValidMedicationsModel = model<ValidMedicationsDocument>('ValidMedications', ValidMedicationsSchema);

export default ValidMedicationsModel;