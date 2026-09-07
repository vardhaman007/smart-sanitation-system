import express from 'express';
import { getUsers, createUser } from '../controllers/usersController.js';

const router = express.Router();

// GET /api/users - Return users for admin purposes
router.get('/', getUsers);

// POST /api/users - Create a new user
router.post('/', createUser);

export default router;
