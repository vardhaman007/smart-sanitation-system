import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';

const router = express.Router();

// GET /api/stats - Return live dashboard metrics from PostgreSQL
router.get('/', getDashboardStats);

export default router;
