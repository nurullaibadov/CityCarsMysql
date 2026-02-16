const express = require('express');
const router = express.Router();
const { Driver } = require('../models');
const { auth, admin } = require('../middleware/auth');

// GET all drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.findAll();
        res.json(drivers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET driver by ID
router.get('/:id', async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST create driver (Admin only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const newDriver = await Driver.create(req.body);
        res.json(newDriver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT update driver (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.update(req.body);
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT Toggle Driver Blacklist (Admin only)
router.put('/:id/blacklist', auth, admin, async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        driver.isBlacklisted = !driver.isBlacklisted;
        await driver.save();

        res.json({ message: `Driver ${driver.isBlacklisted ? 'Blacklisted' : 'Restored'}`, driver });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE driver (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.destroy();
        res.json({ message: 'Driver removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
