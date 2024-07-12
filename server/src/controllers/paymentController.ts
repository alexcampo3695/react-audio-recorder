import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Tasks from '../models/Tasks';
import TasksModel from '../models/Tasks';
import axios from 'axios';
const User = require('../models/Users');
const PaymentMeta = require('../models/PaymentMeta');

const GLASSFY_API_KEY = process.env.GLASSFY_API_KEY;

const validatePurchase = async (transactionId: string) => {
    try {
        const response = await axios.post('https://s2s.glassfy.io/v1/notification-server-to-server/d8f311f6f42c499c984578854a4e58d2/2c9e44aca5b0455d8a81e82bbc897ef7', {
            transactionId: transactionId
        }, {
            headers: {
                'Authorization': `Bearer ${GLASSFY_API_KEY}`
            }, 
        })
        return response.data;
    } catch (e) {
        throw new Error('Failed to validate purchase with Glassfy');
    }
}

export async function postPayment(req: Request, res: Response) {
    const { userId, productId, transactionId, amount} = req.body;

    console.log('glassfy api key:', GLASSFY_API_KEY)

    try {

        if (!GLASSFY_API_KEY) {
            return res.status(500).json({ message: 'Glassfy API key not found'})
        }

        const validation = await validatePurchase(transactionId);

        if (!validation || !validation.valid) {
            return res.status(400).json({ message: 'Invalid transaction' });
        }

        const purchaseData = {
            userId,
            productId,
            transactionId,
            amount,
            purchaseDate: new Date(),
        };

        console.log('purchaseData:', purchaseData);
    
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'User not found' });
    
        let paymentMeta = await PaymentMeta.findOne({ userId: user._id });
    
        if (!paymentMeta) {
            paymentMeta = new PaymentMeta({
                userId: user._id
            })
        }
    
        if (productId === 'monthly_subscription' || productId === 'annual_subscription') {
            paymentMeta.subscription = {
                type: productId === 'monthly_subscription' ? 'monthly' : 'annual',
                startDate: new Date(),
                endDate: productId === 'monthly_subscription' 
                    ? new Date(new Date().setMonth(new Date().getMonth() + 1))
                    : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                status: 'active',
                transactionId,
            };
        } else if (productId === 'pay_per_transaction') {
            paymentMeta.payPerTranscription.remainingTranscriptions += 1;
            paymentMeta.payPerTranscription.transactions.push({
                transactionId,
                date: new Date(),
                amount,
            });
        }
    
        await paymentMeta.save();
        res.status(201).json({ message: 'Payment successful' });
    } catch (e) {
        res.status(500).json({ message: 'Failed to process payment', error: e });
    }
}

