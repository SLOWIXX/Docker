const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

pool.query('SELECT 1')
  .then(() => console.log('Connecté à Postgres'))
  .catch((err) => console.log('Erreur Postgres :', err.message));

app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
