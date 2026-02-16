const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// POST process payment (Simulated)
router.post('/process', async (req, res) => {
    try {
        const { amount, bookingId, cardNumber } = req.body;
        console.log(`Processing payment for booking ${bookingId}: $${amount}`);

        // Simulate an asynchronous payment processor
        await new Promise(resolve => setTimeout(resolve, 2000));

        res.json({
            success: true,
            transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            message: 'Payment processed successfully'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Payment Server Error');
    }
});

module.exports = router;
