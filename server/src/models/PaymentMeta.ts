import mongoose, { Schema, model, Document } from 'mongoose';

interface Subscription {
    type: 'monthly' | 'annual' | 'none';
    startDate: Date;
    endDate: Date;
    status: 'active' | 'inactive' | 'expired' | 'cancelled';
    transactionId: string;
}

interface PayPerTranscriptionTransaction {
    transactionId: string;
    date: Date;
    amount: number;
}

interface PayPerTranscription {
    remainingTranscriptions: number;
    transactions: PayPerTranscriptionTransaction[];
}

export interface IPaymentMeta extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    subscription: Subscription;
    payPerTranscription: PayPerTranscription;
}

const SubscriptionSchema = new Schema<Subscription>({
    type: { type: String, enum: ['monthly', 'annual', 'none'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'inactive', 'expired', 'cancelled'], required: true, default:'inactive' },
    transactionId: { type: String, required: true }
})

const PayPerTranscriptionTransactionSchema = new Schema<PayPerTranscriptionTransaction>({
    transactionId: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true }

})

const PayPerTranscriptionSchema = new Schema<PayPerTranscription>({
    remainingTranscriptions: { type: Number, required: true, default: 0 },
    transactions: [PayPerTranscriptionTransactionSchema]
})

const PaymentMetaSchema = new Schema<IPaymentMeta>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    subscription: SubscriptionSchema,
    payPerTranscription: PayPerTranscriptionSchema
}, {timestamps: true})

const PaymentMeta = mongoose.model<IPaymentMeta>('PaymentMeta', PaymentMetaSchema);

export default PaymentMeta;
