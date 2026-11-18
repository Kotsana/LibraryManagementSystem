const express = require('express');
const cors = require('cors');
const db = require('./db');
const booksRouter = require('./routes/books');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRouter);

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.send(`Library API connected to PostgreSQL! Server time: ${result.rows[0].now}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Database connection failed');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});