import express from 'express';
import { getDbStatus, testConnection } from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const dbHealth = await testConnection();

  res.json({
    status: 'ok',
    service: 'AI-Powered Smart Waste & Sanitation Management Backend',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbHealth.connected,
      status: dbHealth.connected ? 'connected' : 'unavailable',
      ...(dbHealth.error ? { message: dbHealth.error } : {})
    }
  });
});

export default router;
