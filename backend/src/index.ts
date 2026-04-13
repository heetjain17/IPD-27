import 'dotenv/config';
import express from 'express';
import { db } from './db/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
