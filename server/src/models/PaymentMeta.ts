import mongoose, { Document, Schema } from 'mongoose';

interface Subscription {
    type: string;
    startDate: Date;
    endDate: Date;
    status: string;
    transactionId: string;
}

interface PayPerTranscription {
    remainingTranscriptions: number;
    transactions: {
        transactionId: string;
        date: Date;
        amount: number;
    }[];
}

interface IPaymentMeta extends Document {
    userId?: mongoose.Schema.Types.ObjectId;
    originalTransactionId: string;
    subscriberId: string;
    productId: string;
    purchaseDateMs: string;
    price: number;
    currencyCode: string;
    quantity: number;
    eventDate: string;
    subscription?: Subscription;
    payPerTranscription?: PayPerTranscription;
}

const PaymentMetaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriberId: String,
    productId: String,
    eventType: Number,
    store: String,
    originalTransactionId: String,
    purchaseDateMs: Number,
    price: Number,
    currencyCode: String,
    expireDate: Number,
    isSubscriptionActive: Boolean,
    environment: String,
    eventId: String,
    eventDate: Number,
    source: String,
    vendorId: String,
    appId: String,
    originalPurchaseDateMs: Number,
    priceUsd: Number,
    countryCode: String,
    duration: Number,
    customId: String,
    device: String,
    systemVersion: String,
    permissionId: String,
    isValid: Boolean,
    receiptValidated: Boolean,
});



const PaymentMeta = mongoose.model<IPaymentMeta>('PaymentMeta', PaymentMetaSchema);
export default PaymentMeta;