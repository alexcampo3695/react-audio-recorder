import mongoose, { Document, Schema } from 'mongoose';

interface IPaymentMeta extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    subscriberId: string;
    productId: string;
    originalTransactionId: string;
    purchaseDate: Date;
    price: number;
    priceUsd: number;
    currencyCode: string;
    countryCode: string;
    store: string;
    environment: string;
    isSubscriptionActive: boolean;
    expireDate: Date;
    eventType: number;
    eventId: string;
    eventDate: Date;
    source: string;
    vendorId: string;
    appId: string;
    customId?: string;
    device?: string;
    systemVersion?: string;
    receiptValidated: boolean;
    appleReceiptValidated: boolean;
    glassfyValidated: boolean;
}

const PaymentMetaSchema = new Schema<IPaymentMeta>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscriberId: { type: String, required: true },
    productId: { type: String, required: true },
    originalTransactionId: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    price: { type: Number, required: true },
    priceUsd: { type: Number, required: true },
    currencyCode: { type: String, required: true },
    countryCode: { type: String, required: true },
    store: { type: String, required: true },
    environment: { type: String, required: true },
    isSubscriptionActive: { type: Boolean, default: false },
    expireDate: { type: Date },
    eventType: { type: Number, required: true },
    eventId: { type: String, required: true },
    eventDate: { type: Date, required: true },
    source: { type: String },
    vendorId: { type: String },
    appId: { type: String },
    customId: { type: String },
    device: { type: String },
    systemVersion: { type: String },
    receiptValidated: { type: Boolean, default: false },
    appleReceiptValidated: { type: Boolean, default: false },
    glassfyValidated: { type: Boolean, default: false }
}, {
    timestamps: true
});

const PaymentMeta = mongoose.model<IPaymentMeta>('PaymentMeta', PaymentMetaSchema);
export default PaymentMeta;