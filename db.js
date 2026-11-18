const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'library_management',
  password: 'TheJoker',
  port: 5432,
});

module.exports = pool;