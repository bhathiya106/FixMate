import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
  const { amount, currency = 'lkr', orderData } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.json({ success: false, message: 'Invalid amount' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: orderData?.orderId || '',
        userId: orderData?.userId || '',
        productId: orderData?.productId || '',
        productName: orderData?.productName || ''
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.log('Payment intent creation error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Confirm payment and process order
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderData } = req.body;

    // Retrieve payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Payment successful - you can process the order here
      // For now, we'll just return success
      res.json({
        success: true,
        message: 'Payment successful',
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.log('Payment confirmation error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Webhook to handle Stripe events
const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Handle successful payment here
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      // Handle failed payment here
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export { createPaymentIntent, confirmPayment, webhookHandler };