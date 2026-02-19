const express = require('express');
const router = express.Router();
const { Booking, User, Car, Driver } = require('../models');
const { auth, admin } = require('../middleware/auth');

// POST create booking (Authenticated user)
router.post('/', auth, async (req, res) => {
    try {
        const {
            carId, driverId, startDate, endDate, pickupDate, returnDate,
            pickupTime, returnTime, firstName, lastName, email, phone,
            totalPrice, pickupLocation, returnLocation,
            insurance, gps, childSeat, additionalDriver, paymentMethod,
            stripePaymentIntentId
        } = req.body;

        // New bookings always start as 'pending' until payment is confirmed
        const newBooking = await Booking.create({
            userId: req.user.id,
            carId,
            driverId: driverId || null,
            startDate: startDate || pickupDate,
            endDate: endDate || returnDate,
            pickupDate: pickupDate || startDate,
            pickupTime: pickupTime || '12:00',
            returnDate: returnDate || endDate,
            returnTime: returnTime || '12:00',
            firstName,
            lastName,
            email,
            phone,
            totalPrice,
            status: 'pending',
            paymentStatus: 'pending',
            stripePaymentIntentId: stripePaymentIntentId || null,
            pickupLocation,
            returnLocation,
            insurance,
            gps,
            childSeat,
            additionalDriver,
            paymentMethod
        });

        res.json(newBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET all bookings (Admin sees all, User sees own)
router.get('/', auth, async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'admin') {
            bookings = await Booking.findAll({
                include: [
                    { model: User, attributes: ['id', 'email', 'role'] },
                    { model: Car },
                    { model: Driver }
                ],
                order: [['createdAt', 'DESC']]
            });
        } else {
            bookings = await Booking.findAll({
                where: { userId: req.user.id },
                include: [
                    { model: Car },
                    { model: Driver }
                ],
                order: [['createdAt', 'DESC']]
            });
        }
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT update booking status (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        await booking.update(updateData);
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE booking (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await booking.destroy();
        res.json({ message: 'Booking removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET booking tracking info (Publicly accessible with ID)
router.get('/:id/tracking', async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                { model: Car, attributes: ['name'] },
                { model: Driver, attributes: ['name'] }
            ]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Return a subset of data for tracking
        const trackingData = {
            id: booking.id,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            startDate: booking.startDate,
            endDate: booking.endDate,
            vehicleName: booking.Car ? booking.Car.name : 'Premium Fleet',
            driverName: booking.Driver ? booking.Driver.name : 'Allocating Specialist...',
            pickupLocation: booking.pickupLocation || 'Baku International Airport',
            returnLocation: booking.returnLocation || 'Baku International Airport',
            progress: booking.status === 'completed' ? 100 :
                booking.status === 'active' || booking.status === 'confirmed' ? 65 :
                    booking.status === 'in_transit' ? 85 : 15
        };

        res.json(trackingData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
