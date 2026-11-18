const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add user
router.post('/', async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const result = await db.query(
            `INSERT INTO users (name, email, role)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, email, role || 'Student']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const result = await db.query(
            `UPDATE users
             SET name = $1, email = $2, role = $3
             WHERE id = $4
             RETURNING *`,
            [name, email, role, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;