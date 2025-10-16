import express from 'express';
import { createPaymentIntent, confirmPayment, webhookHandler } from '../controllers/paymentController.js';
import userAuth from '../middleware/userAuth.js';

const paymentRouter = express.Router();

// Create payment intent (requires authentication)
paymentRouter.post('/create-payment-intent', userAuth, createPaymentIntent);

// Confirm payment (requires authentication)
paymentRouter.post('/confirm-payment', userAuth, confirmPayment);

// Webhook for Stripe events (no auth needed)
paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

export default paymentRouter;