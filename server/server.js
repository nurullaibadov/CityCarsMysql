const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./database');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Connect to SQL Server
connectDB();

const app = express();

// Stripe webhook needs raw body - must be before JSON parser
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:8081',
        'http://localhost:8080',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev')); // Logging

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200 // Increased limit for payment flows
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/messages', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/news', require('./routes/news'));

// Basic route
app.get('/', (req, res) => {
    res.send('CityCars.az API Running (PostgreSQL Backend with Stripe Payments)');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend URL allowed: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`Stripe integration: ${process.env.STRIPE_SECRET_KEY ? '✅ Configured' : '❌ Missing STRIPE_SECRET_KEY'}`);
});
