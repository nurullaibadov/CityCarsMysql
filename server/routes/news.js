const express = require('express');
const router = express.Router();
const { News } = require('../models');
const { auth, admin } = require('../middleware/auth');

// GET all news (Publicly accessible)
router.get('/', async (req, res) => {
    try {
        const newsList = await News.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(newsList);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET single news item
router.get('/:id', async (req, res) => {
    try {
        const newsItem = await News.findByPk(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ message: 'News item not found' });
        }
        res.json(newsItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST create news (Admin only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const { title, content, image, category, author } = req.body;
        const newNews = await News.create({
            title,
            content,
            image,
            category,
            author
        });
        res.json(newNews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT update news (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const { title, content, image, category, author } = req.body;
        const newsItem = await News.findByPk(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ message: 'News item not found' });
        }
        await newsItem.update({ title, content, image, category, author });
        res.json(newsItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE news (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const newsItem = await News.findByPk(req.params.id);
        if (!newsItem) {
            return res.status(404).json({ message: 'News item not found' });
        }
        await newsItem.destroy();
        res.json({ message: 'News item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
