const express = require('express');
const router = express.Router();
const { Car } = require('../models');
const { auth, admin } = require('../middleware/auth');

// GET all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.findAll();
        res.json(cars);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET car by ID
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST create car (Admin only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const newCar = await Car.create(req.body);
        res.json(newCar);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT update car (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        await car.update(req.body);
        res.json(car);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE car (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const car = await Car.findByPk(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        await car.destroy();
        res.json({ message: 'Car removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
