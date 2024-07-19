import mongoose, { Document, Schema } from 'mongoose';

interface IPaymentMeta extends Document {
    userId: string;
    subscriberId: string;
    productId: string;
    original_transaction_id: string;
    purchaseDate: Date;
    price: number;
    priceUsd: number;
    currency_code: string;
    country_code: string;
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
    userId: { type: String, ref: 'User', required: false },
    subscriberId: { type: String, required: true },
    productId: { type: String, required: true },
    original_transaction_id: { type: String, required: false },
    purchaseDate: { type: Date, required: true },
    price: { type: Number, required: true },
    priceUsd: { type: Number, required: true },
    currency_code: { type: String, required: false },
    country_code: { type: String, required: false },
    store: { type: String, required: false },
    environment: { type: String, required: false },
    isSubscriptionActive: { type: Boolean, default: false },
    expireDate: { type: Date },
    eventType: { type: Number, required: true },
    eventId: { type: String, required: false },
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