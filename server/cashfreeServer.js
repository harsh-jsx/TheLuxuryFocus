// Cashfree backend: creates payment sessions for checkout.
// Run: npm run server  (loads .env from project root)

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Cashfree } from 'cashfree-pg';

const app = express();
const port = process.env.PORT || 5000;

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();

app.use(cors());
app.use(express.json());

app.post('/api/cashfree/create-session', async (req, res) => {
    try {
        const { orderId, orderAmount, customer } = req.body || {};

        if (!orderAmount || !customer?.customer_email || !customer?.customer_phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const baseReturnUrl = (process.env.CASHFREE_RETURN_URL || 'http://localhost:5173/').replace(/\/$/, '');
        const returnUrl = `${baseReturnUrl}/?payment=return&order_id=${encodeURIComponent(orderId)}`;

        const request = {
            order_id: String(orderId),
            order_amount: Number(orderAmount),
            order_currency: 'INR',
            customer_details: {
                customer_id: customer.customer_id || `user_${Date.now()}`,
                customer_name: customer.customer_name || 'Customer',
                customer_email: customer.customer_email,
                customer_phone: String(customer.customer_phone).replace(/\D/g, '').slice(-10) || '9999999999',
            },
            order_meta: {
                return_url: returnUrl,
            },
        };

        const apiVersion = process.env.CASHFREE_API_VERSION || '2022-09-01';
        const response = await Cashfree.PGCreateOrder(apiVersion, request);

        if (response.status !== 200) {
            console.error('Cashfree PGCreateOrder failed', response.data);
            return res.status(500).json({ error: 'Failed to create order with Cashfree' });
        }

        const paymentSessionId = response.data?.payment_session_id;
        if (!paymentSessionId) {
            console.error('No payment_session_id in Cashfree response', response.data);
            return res.status(500).json({ error: 'Invalid response from Cashfree' });
        }

        res.json({ paymentSessionId, orderId: response.data.order_id });
    } catch (err) {
        console.error('Error in /api/cashfree/create-session', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Cashfree server running on port ${port}`);
});

