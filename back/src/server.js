const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

pool.query(`
  CREATE TABLE IF NOT EXISTS citations (
    id SERIAL PRIMARY KEY,
    texte TEXT NOT NULL,
    auteur TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`)
  .then(() => console.log('Table citations prête'))
  .catch((err) => console.log('Erreur Postgres :', err.message));

app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
