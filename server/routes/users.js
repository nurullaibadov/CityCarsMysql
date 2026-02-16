const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { auth, admin } = require('../middleware/auth');

// GET all users (Admin only)
router.get('/', auth, admin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT Toggle Blacklist (Admin only)
router.put('/:id/blacklist', auth, admin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBlacklisted = !user.isBlacklisted;
        await user.save();

        res.json({ message: `User ${user.isBlacklisted ? 'Blacklisted' : 'Unblocked'}`, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE User (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT Toggle Admin Role (Admin only)
router.put('/:id/role', auth, admin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();

        res.json({ message: `User role updated to ${user.role}`, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
