const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/citations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM citations ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/citations', async (req, res) => {
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).json({ error: 'text and author are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO citations (text, author) VALUES ($1, $2) RETURNING *',
      [text, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS citations (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`)
  .then(() => console.log('Table citations prête'))
  .catch((err) => {
    console.log('Erreur Postgres :', err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
