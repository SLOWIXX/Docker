const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  user: process.env.POSTGRES_USER || 'citations',
  password: process.env.POSTGRES_PASSWORD || 'citations',
  database: process.env.POSTGRES_DB || 'citations',
});

module.exports = pool;
