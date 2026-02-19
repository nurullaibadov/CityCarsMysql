const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Booking } = require('../models');

// Initialize Stripe with secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST create a Stripe Payment Intent
router.post('/create-payment-intent', auth, async (req, res) => {
    try {
        const { amount, bookingId, currency } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Convert to cents (Stripe expects smallest currency unit)
        const amountInCents = Math.round(amount * 100);

        // Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: currency || 'usd',
            metadata: {
                bookingId: bookingId ? String(bookingId) : '',
                userId: String(req.user.id)
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (err) {
        console.error('Stripe Payment Intent Error:', err.message);
        res.status(500).json({ message: 'Payment processing failed', error: err.message });
    }
});

// POST confirm payment and update booking
router.post('/confirm-payment', auth, async (req, res) => {
    try {
        const { paymentIntentId, bookingId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ message: 'Payment intent ID required' });
        }

        // Verify the payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update booking payment status
            if (bookingId) {
                const booking = await Booking.findByPk(bookingId);
                if (booking) {
                    await booking.update({
                        paymentStatus: 'paid',
                        status: 'confirmed',
                        stripePaymentIntentId: paymentIntentId
                    });
                }
            }

            res.json({
                success: true,
                message: 'Payment confirmed successfully',
                paymentStatus: paymentIntent.status
            });
        } else {
            res.json({
                success: false,
                message: `Payment status: ${paymentIntent.status}`,
                paymentStatus: paymentIntent.status
            });
        }
    } catch (err) {
        console.error('Payment Confirmation Error:', err.message);
        res.status(500).json({ message: 'Payment confirmation failed', error: err.message });
    }
});

// Stripe Webhook (for production use)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (endpointSecret && sig) {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            event = req.body;
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`✅ PaymentIntent succeeded: ${paymentIntent.id}`);

            // Update booking if metadata contains bookingId
            if (paymentIntent.metadata?.bookingId) {
                try {
                    const booking = await Booking.findByPk(paymentIntent.metadata.bookingId);
                    if (booking) {
                        await booking.update({
                            paymentStatus: 'paid',
                            status: 'confirmed',
                            stripePaymentIntentId: paymentIntent.id
                        });
                    }
                } catch (dbErr) {
                    console.error('DB update from webhook failed:', dbErr.message);
                }
            }
            break;

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object;
            console.log(`❌ PaymentIntent failed: ${failedIntent.id}`);

            if (failedIntent.metadata?.bookingId) {
                try {
                    const booking = await Booking.findByPk(failedIntent.metadata.bookingId);
                    if (booking) {
                        await booking.update({
                            paymentStatus: 'failed',
                            stripePaymentIntentId: failedIntent.id
                        });
                    }
                } catch (dbErr) {
                    console.error('DB update from webhook failed:', dbErr.message);
                }
            }
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
});

module.exports = router;
