const express = require('express');
const router = express.Router();
const db = require('../db');

// Get transaction history
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT t.*, b.title AS book_title, u.name AS user_name
            FROM transactions t
            LEFT JOIN books b ON t.book_id = b.id
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Borrow or return a book
router.post('/', async (req, res) => {
    const { book_id, user_id, type, quantity } = req.body;

    try {
        const amount = Number(quantity);

        if (!book_id || !user_id || !['Borrow', 'Return'].includes(type) || amount < 1) {
            return res.status(400).json({ message: 'Invalid transaction details' });
        }

        const book = await db.query(
            'SELECT * FROM books WHERE id = $1',
            [book_id]
        );

        if (book.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (type === 'Borrow' && book.rows[0].quantity < amount) {
            return res.status(400).json({ message: 'Not enough books in stock' });
        }

        const newQuantity = type === 'Borrow'
            ? book.rows[0].quantity - amount
            : book.rows[0].quantity + amount;

        await db.query(
            'UPDATE books SET quantity = $1 WHERE id = $2',
            [newQuantity, book_id]
        );

        const transaction = await db.query(
            `INSERT INTO transactions (book_id, user_id, type, quantity)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [book_id, user_id, type, amount]
        );

        res.status(201).json(transaction.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete transaction record
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;