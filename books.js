const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all books
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADD book
router.post('/', async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        const result = await db.query(
            `INSERT INTO books (title, author, genre, isbn, quantity)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [title, author, genre, isbn, quantity]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE book
router.put('/:id', async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        const result = await db.query(
            `UPDATE books
             SET title = $1, author = $2, genre = $3, isbn = $4, quantity = $5
             WHERE id = $6
             RETURNING *`,
            [title, author, genre, isbn, quantity, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE book
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM books WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;