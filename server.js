const express = require('express');
const cors = require('cors');
const db = require('./db');
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.send(`PostgreSQL connected: ${result.rows[0].now}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
});

app.listen(5000, () => {
    console.log('SERVER.JS IS RUNNING — PORT 5000');
});