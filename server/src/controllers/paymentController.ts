import { Request, Response } from 'express';
import PaymentMeta from '../models/PaymentMeta';
import mongoose from 'mongoose';

const GLASSFY_API_KEY = process.env.GLASSFY_API_KEY;

interface GlassfyPermissionPayload {
    permissions: {
        subscriberId: string;
        all: Array<{
            accountableSkus: Array<{ productId: string }>;
            permissionId: string;
            isValid: boolean;
            expireDate: number;
        }>;
    };
    productId: string;
    receiptValidated: boolean;
}

export async function glassfyWebHook(req: Request, res: Response) {
    console.log('Received Glassfy webhook data:', JSON.stringify(req.body, null, 2));

    try {
        const event = req.body;
        const { userId } = req.params;
        let payment;

        const ensureField = (field: any, defaultValue: any) => field !== undefined ? field : defaultValue;

        if (event.permissions) {
            // Handle the first type of payload (permissions)
            const { permissions, productId, receiptValidated } = event as GlassfyPermissionPayload;
            const relevantPermission = permissions.all.find(p => p.accountableSkus.some(sku => sku.productId === productId));

            if (!relevantPermission) {
                throw new Error('No relevant permission found');
            }

            payment = new PaymentMeta({
                userId: userId,
                subscriberId: permissions.subscriberId,
                productId,
                permissionId: relevantPermission.permissionId,
                isValid: relevantPermission.isValid,
                expireDate: new Date(relevantPermission.expireDate),
                receiptValidated,
                eventType: ensureField(event.type, 0), 
                eventId: ensureField(event.id, ''), 
                environment: ensureField(event.environment, ''), 
                store: ensureField(event.store, ''), 
                countryCode: ensureField(event.country_code, ''), 
                currencyCode: ensureField(event.currency_code, ''), 
                priceUsd: ensureField(event.price_usd, 0), 
                price: ensureField(event.price, 0), 
                purchaseDate: new Date(ensureField(event.date_ms, Date.now())), 
                originalTransactionId: ensureField(event.original_transaction_id, ''), 
                eventDate: new Date(ensureField(event.event_date, Date.now())),
                isSubscriptionActive: true,
            });
        } else if (event.subscriberid && event.productid) {
            // Handle the second type of payload (event)
            payment = new PaymentMeta({
                userId: event.userId, // Ensure this is a valid ObjectId
                subscriberId: event.subscriberid,
                productId: event.productid,
                eventType: ensureField(event.type, 0), 
                store: ensureField(event.store, ''), 
                originalTransactionId: ensureField(event.original_transaction_id, ''), 
                purchaseDate: new Date(ensureField(event.date_ms, Date.now())), 
                price: event.price || 0, 
                currencyCode: ensureField(event.currency_code, ''), 
                expireDate: new Date(ensureField(event.expire_date_ms, Date.now())), 
                isSubscriptionActive: true, 
                environment: ensureField(event.environment, ''), 
                eventId: ensureField(event.id, ''), 
                eventDate: new Date(ensureField(event.event_date, Date.now())), 
                source: ensureField(event.source, ''), 
                vendorId: ensureField(event.vendorid, ''), 
                appId: ensureField(event.appid, ''), 
                originalPurchaseDateMs: new Date(ensureField(event.original_purchase_date_ms, Date.now())), 
                priceUsd: event.price_usd || 0, 
                countryCode: ensureField(event.country_code, ''), 
                duration: ensureField(event.duration, 0), 
                customId: ensureField(event.customid, ''), 
                device: ensureField(event.device, ''), 
                systemVersion: ensureField(event.system_version, ''),
                receiptValidated: event.receiptValidated || true,
                appleReceiptValidated: event.apple_receipt_validated || false,
                glassfyValidated: event.glassfy_validated || true,
            });
        } else {
            throw new Error('Unrecognized event payload structure');
        }

        await payment.save();

        console.log('Payment saved successfully:', payment);
        res.status(200).json({ message: 'Successfully processed Glassfy event!' });
    } catch (error) {
        console.error('Failed to process Glassfy event', error);
        res.status(500).json({ message: 'Failed to process Glassfy event', error: error });
    }
}

export async function getPaymentMetaBySuscriber(req: Request, res: Response) {
    const { userId } = req.params;
    console.log('Fetching payment meta for user:', userId);
    try {
        const payments = await PaymentMeta.find({ userId: userId });

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "Payments not found" });
        }

        res.status(200).json(payments);
    } catch (error) {
        console.error('Failed to fetch payment meta:', error);
        res.status(500).json({ message: 'Failed to fetch payment meta', error: error });
    }
}
