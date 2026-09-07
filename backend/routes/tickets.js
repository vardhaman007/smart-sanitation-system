import express from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  assignWorker,
  updateStatus,
  deleteTicket
} from '../controllers/ticketsController.js';
import upload from '../middleware/upload.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC — Citizens can raise complaints without staff login
router.post('/', upload.single('image'), createTicket);

// PROTECTED — Admin and Workers can view tickets
router.get('/', authenticateToken, requireRole('admin', 'worker'), getAllTickets);
router.get('/:id', authenticateToken, requireRole('admin', 'worker'), getTicketById);

// ADMIN ONLY — General ticket modifications
router.patch('/:id', authenticateToken, requireRole('admin'), updateTicket);

// ADMIN ONLY — Assign tickets to workers
router.patch('/:id/assign', authenticateToken, requireRole('admin'), assignWorker);

// ADMIN + WORKER — Update ticket status / resolution
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole('admin', 'worker'),
  upload.single('after_image'),
  updateStatus
);

// ADMIN ONLY — Delete tickets
router.delete('/:id', authenticateToken, requireRole('admin'), deleteTicket);

export default router;
