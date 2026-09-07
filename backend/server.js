import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import healthRoutes from './routes/health.js';
import ticketsRoutes from './routes/tickets.js';
import workersRoutes from './routes/workers.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';
import errorHandler from './middleware/errorHandler.js';
import { testConnection } from './db/connection.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration (allow Vite dev servers)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'https://edmonton-footage-indicators-wheels.trycloudflare.com', 'https://smart-sanitation-system.vercel.app'],
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static file serving for evidence images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root info route
app.get('/', (req, res) => {
  res.json({
    name: 'AI-Powered Smart Waste & Sanitation Management System API',
    stage: 'Stage 3 - Backend + PostgreSQL Integration',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      tickets: '/api/tickets',
      workers: '/api/workers',
      users: '/api/users'
    }
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log('================================================================');
  console.log(`🚀 Smart Sanitation Backend API running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log('================================================================');

  // Verify PostgreSQL database connection on start
  await testConnection();
});

export default app;

