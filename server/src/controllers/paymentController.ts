import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Tasks from '../models/Tasks';
import TasksModel from '../models/Tasks';
import axios from 'axios';
import { parse } from 'dotenv';
const User = require('../models/Users');
import PaymentMeta from '../models/PaymentMeta';

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
        let payment;

        if (event.permissions) {
            // Handle the first type of payload (permissions)
            const { permissions, productId, receiptValidated } = event as GlassfyPermissionPayload;
            const relevantPermission = permissions.all.find(p => p.accountableSkus.some(sku => sku.productId === productId));

            if (!relevantPermission) {
                throw new Error('No relevant permission found');
            }

            payment = new PaymentMeta({
                subscriberId: permissions.subscriberId,
                productId,
                permissionId: relevantPermission.permissionId,
                isValid: relevantPermission.isValid,
                expireDate: new Date(relevantPermission.expireDate),
                receiptValidated,
            });
        } else if (event.subscriberid && event.productid) {
            // Handle the second type of payload (event)
            payment = new PaymentMeta({
                subscriberId: event.subscriberid,
                productId: event.productid,
                eventType: event.type,
                store: event.store,
                originalTransactionId: event.original_transaction_id,
                purchaseDateMs: new Date(event.date_ms),
                price: event.price,
                currencyCode: event.currency_code,
                expireDate: new Date(event.expire_date_ms),
                isSubscriptionActive: event.is_subscription_active,
                environment: event.environment,
                eventId: event.id,
                eventDate: new Date(event.event_date),
                source: event.source,
                vendorId: event.vendorid,
                appId: event.appid,
                originalPurchaseDateMs: new Date (event.original_purchase_date_ms),
                priceUsd: event.price_usd,
                countryCode: event.country_code,
                duration: event.duration,
                customId: event.customid,
                device: event.device,
                systemVersion: event.system_version,
            });
        } else {
            throw new Error('Unrecognized event payload structure');
        }

        await payment.save();

        console.log('Payment saved successfully:', payment);
        res.status(200).json({ message: 'Successfully processed Glassfy event!' });
    } catch (error) {
        console.error('Failed to process Glassfy event', error);
        console.error('Event payload:', JSON.stringify(req.body, null, 2));
        res.status(500).json({ message: 'Failed to process Glassfy event', error });
    }
}

export async function getPaymentMetaBySuscriber(req: Request, res: Response) {
    const { subscriberId } = req.params;
    try {
        const payments = await PaymentMeta.find({ subscriberId });

        if (!payments) {
            return res.status(404).json({ message: "Payments not found" });
        }
        
        res.status(200).json(payments);
    } catch (error) {
        console.error('Failed to fetch payment meta:', error);
        res.status(500).json({ message: 'Failed to fetch payment meta', error });
    }
}