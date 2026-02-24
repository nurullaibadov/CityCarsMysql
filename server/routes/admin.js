const express = require('express');
const router = express.Router();
const { Booking, User, Car, Driver, Contact } = require('../models');
const { auth, admin } = require('../middleware/auth');
const { sequelize } = require('../database');
const { Op } = require('sequelize');

// GET Revenue stats
router.get('/revenue', auth, admin, async (req, res) => {
    try {
        // Total Revenue
        const totalRevenue = await Booking.sum('totalPrice');

        // Revenue by Status
        // Expects: [{ _id: 'confirmed', count: 5, revenue: 1000 }, ...]
        const byStatusRaw = await Booking.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
            ],
            group: ['status']
        });

        const byStatus = byStatusRaw.map(item => ({
            _id: item.getDataValue('status'), // Map status to _id for frontend compatibility
            count: parseInt(item.getDataValue('count')),
            revenue: parseFloat(item.getDataValue('revenue')) || 0
        }));

        // Monthly Revenue
        // SQL Server: FORMAT(createdAt, 'yyyy-MM') or similar
        // For portability/simplicity, we can fetch all and process in JS if small, 
        // BUT better to use DB grouping.
        // Sequelize generic: 

        // Since we are on SQL Server specifically:
        const monthlyRaw = await Booking.findAll({
            attributes: [
                [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
            ],
            group: [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM')],
            order: [[sequelize.col('month'), 'ASC']],
            limit: 6
        });

        const monthly = monthlyRaw.map(item => ({
            _id: item.getDataValue('month'),
            count: parseInt(item.getDataValue('count')),
            revenue: parseFloat(item.getDataValue('revenue')) || 0
        }));

        res.json({
            total: totalRevenue || 0,
            byStatus,
            monthly
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET Analytics (Weekly) - Filled with 0s for missing days
router.get('/analytics', auth, admin, async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyRaw = await Booking.findAll({
            attributes: [
                [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM-DD'), 'day'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'bookings'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
            ],
            where: {
                createdAt: { [Op.gte]: sevenDaysAgo }
            },
            group: [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM-DD')],
            order: [[sequelize.col('day'), 'ASC']]
        });

        // Fill missing days
        const analytics = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i)); // Go back from today
            const dateStr = date.toISOString().split('T')[0];

            const found = dailyRaw.find(item => item.getDataValue('day') === dateStr);

            analytics.push({
                name: days[date.getDay()],
                bookings: found ? parseInt(found.getDataValue('bookings')) : 0,
                revenue: found ? parseFloat(found.getDataValue('revenue')) : 0
            });
        }

        res.json(analytics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET Stats by Car Type
router.get('/stats/car-types', auth, admin, async (req, res) => {
    try {
        const stats = await Booking.findAll({
            attributes: [
                [sequelize.col('Car.type'), 'type'], // Group by car type
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'value'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
            ],
            include: [{ model: Car, attributes: [] }], // Include Car model but don't select all fields
            group: ['Car.type'],
            raw: true
        });

        // Handle null types if any
        const formatted = stats.map(s => ({
            name: s.type || 'Unspecified',
            value: parseInt(s.value),
            revenue: parseFloat(s.revenue)
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET Stats by Booking Status
router.get('/stats/status-distribution', auth, admin, async (req, res) => {
    try {
        const stats = await Booking.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'value']
            ],
            group: ['status'],
            raw: true
        });

        const formatted = stats.map(s => ({
            name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
            value: parseInt(s.value)
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET User Growth (Last 6 Months)
router.get('/stats/user-growth', auth, admin, async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1); // Start of month

        const growthRaw = await User.findAll({
            attributes: [
                [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'users']
            ],
            where: {
                createdAt: { [Op.gte]: sixMonthsAgo }
            },
            group: [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM')],
            order: [[sequelize.col('month'), 'ASC']],
            raw: true
        });

        res.json(growthRaw.map(g => ({
            name: g.month, // "2024-02"
            users: parseInt(g.users)
        })));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET Dashboard Stats
router.get('/stats', auth, admin, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            cars,
            bookings,
            users,
            messages,
            drivers,
            revenue,
            todayBookings,
            todayUsers,
            todayMessages,
            pendingBookings
        ] = await Promise.all([
            Car.count(),
            Booking.count(),
            User.count(),
            Contact.count(),
            Driver.count(),
            Booking.sum('totalPrice'),
            Booking.count({ where: { createdAt: { [Op.gte]: today } } }),
            User.count({ where: { createdAt: { [Op.gte]: today } } }),
            Contact.count({ where: { createdAt: { [Op.gte]: today } } }),
            Booking.count({ where: { status: 'pending' } })
        ]);

        res.json({
            cars,
            bookings,
            users,
            messages,
            drivers,
            revenue: revenue || 0,
            todayBookings,
            todayUsers,
            todayMessages,
            pendingBookings
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET Recent Activities
router.get('/activities', auth, admin, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const [bookings, users, messages] = await Promise.all([
            Booking.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                include: [{ model: User, attributes: ['email'] }, { model: Car, attributes: ['name'] }]
            }),
            User.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                attributes: ['email', 'createdAt']
            }),
            Contact.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                attributes: ['name', 'subject', 'createdAt']
            })
        ]);

        const activities = [];

        bookings.forEach(b => {
            activities.push({
                user: b.User ? b.User.email.split('@')[0] : (b.firstName || 'Guest'),
                action: 'booked',
                item: b.Car ? b.Car.name : 'a vehicle',
                timeAgo: timeAgo(b.createdAt),
                timestamp: new Date(b.createdAt).getTime(),
                color: 'bg-blue-500'
            });
        });

        users.forEach(u => {
            activities.push({
                user: u.email.split('@')[0],
                action: 'joined',
                item: 'the platform',
                timeAgo: timeAgo(u.createdAt),
                timestamp: new Date(u.createdAt).getTime(),
                color: 'bg-indigo-500'
            });
        });

        messages.forEach(m => {
            activities.push({
                user: m.name,
                action: 'sent inquiry',
                item: `"${m.subject}"`,
                timeAgo: timeAgo(m.createdAt),
                timestamp: new Date(m.createdAt).getTime(),
                color: 'bg-emerald-500'
            });
        });

        // Sort by timestamp and limit
        activities.sort((a, b) => b.timestamp - a.timestamp);

        res.json(activities.slice(0, limit));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET Top Vehicles
router.get('/top-vehicles', auth, admin, async (req, res) => {
    try {
        const topVehicles = await Booking.findAll({
            attributes: [
                'carId',
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'bookings'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
            ],
            include: [{ model: Car, attributes: ['name'] }],
            group: ['Booking.carId', 'Car.id', 'Car.name'], // Need to group by Car details too
            order: [[sequelize.literal('revenue'), 'DESC']],
            limit: 5
        });

        const formatted = topVehicles.map(item => ({
            _id: item.Car ? item.Car.name : 'Unknown', // Frontend expects _id as name
            bookings: parseInt(item.getDataValue('bookings')),
            revenue: parseFloat(item.getDataValue('revenue')) || 0
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Helper for timeAgo
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}


module.exports = router;
