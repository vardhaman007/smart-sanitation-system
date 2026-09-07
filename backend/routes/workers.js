import express from 'express';
import { getWorkers, getWorkerTickets } from '../controllers/workersController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/workers - Admin and Workers only
router.get('/', authenticateToken, requireRole('admin', 'worker'), getWorkers);

// GET /api/workers/:id/tickets - Admin and Workers only
router.get('/:id/tickets', authenticateToken, requireRole('admin', 'worker'), getWorkerTickets);

export default router;
