import express from 'express';
import axios from 'axios';
import crypto from 'crypto';
import prisma from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// -------------------- PAYSTACK -------------------- //
router.post('/paystack', authenticateToken, async (req, res, next) => {
  try {
    const { orderId, amount, email } = req.body;

    if (!orderId || !amount || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify order exists
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId && order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

    // Generate reference
    const reference = `paystack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize Paystack transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: Math.round(amount * 100),
        reference,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback?provider=paystack&orderId=${orderId}`,
        metadata: { orderId, userId: req.user.id }
      },
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' } }
    );

    if (response.data.status) {
      await prisma.payment.create({
        data: {
          orderId,
          provider: 'paystack',
          reference,
          amount: parseFloat(amount),
          currency: 'NGN',
          status: 'pending'
        }
      });

      await prisma.order.update({ where: { id: orderId }, data: { paymentMethod: 'paystack' } });

      return res.json({
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference
      });
    }

    throw new Error('Failed to initialize Paystack payment');
  } catch (error) {
    next(error);
  }
});

// -------------------- FLUTTERWAVE -------------------- //
router.post('/flutterwave', authenticateToken, async (req, res, next) => {
  try {
    const { orderId, amount, currency = 'NGN', email } = req.body;

    if (!orderId || !amount || !email) return res.status(400).json({ error: 'Missing required fields' });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId && order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

    const txRef = `flw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: txRef,
        amount,
        currency: currency.toUpperCase(),
        redirect_url: `${process.env.FRONTEND_URL}/payment/callback?provider=flutterwave&orderId=${orderId}`,
        customer: { email, name: order.userName || 'Customer' },
        meta: { orderId, userId: req.user.id }
      },
      { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, 'Content-Type': 'application/json' } }
    );

    if (response.data.status === 'success') {
      await prisma.payment.create({
        data: {
          orderId,
          provider: 'flutterwave',
          reference: txRef,
          amount: parseFloat(amount),
          currency: currency.toUpperCase(),
          status: 'pending',
          metadata: JSON.stringify({ paymentLink: response.data.data.link })
        }
      });

      await prisma.order.update({ where: { id: orderId }, data: { paymentMethod: 'flutterwave' } });

      return res.json({ paymentLink: response.data.data.link, reference: txRef });
    }

    throw new Error('Failed to initialize Flutterwave payment');
  } catch (error) {
    next(error);
  }
});

// -------------------- PAYSTACK WEBHOOK -------------------- //
router.post('/webhooks/paystack', async (req, res, next) => {
  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) return res.status(400).json({ error: 'Invalid signature' });

    const event = req.body;
    if (event.event === 'charge.success') {
      const { reference, amount } = event.data;

      const payment = await prisma.payment.findUnique({ where: { reference } });
      if (payment && payment.status === 'pending') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'success', metadata: JSON.stringify(event.data) } });
        await prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'paid', orderStatus: 'paid' } });
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

// -------------------- FLUTTERWAVE WEBHOOK -------------------- //
router.post('/webhooks/flutterwave', async (req, res, next) => {
  try {
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
    const signature = req.headers['verif-hash'];

    if (!secretHash || !signature || signature !== secretHash) return res.status(400).json({ error: 'Invalid signature' });

    const event = req.body;
    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const { tx_ref: reference } = event.data;

      const payment = await prisma.payment.findUnique({ where: { reference } });
      if (payment && payment.status === 'pending') {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'success', metadata: JSON.stringify(event.data) } });
        await prisma.order.update({ where: { id: payment.orderId }, data: { paymentStatus: 'paid', orderStatus: 'paid' } });
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

export default router;
