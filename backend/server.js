const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurace připojení k PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Inicializace databáze
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_data (
        id SERIAL PRIMARY KEY,
        test_name VARCHAR(255) NOT NULL,
        test_value VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Databáze inicializována');
  } catch (err) {
    console.error('Chyba při inicializaci databáze:', err);
  }
}

// API endpoint pro uložení testovacích dat
app.post('/api/test-data', async (req, res) => {
  try {
    const { testName, testValue } = req.body;
    const result = await pool.query(
      'INSERT INTO test_data (test_name, test_value) VALUES ($1, $2) RETURNING *',
      [testName, testValue]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chyba při ukládání dat' });
  }
});

// API endpoint pro získání testovacích dat
app.get('/api/test-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM test_data ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chyba při načítání dat' });
  }
});

// Inicializace databáze při startu
initDb();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
}); 