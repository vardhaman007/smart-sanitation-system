const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = 5000;

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'ok',
      service: 'AI-Powered Smart Waste & Sanitation Management Backend',
      database: {
        connected: true,
        status: 'available'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: {
        connected: false,
        status: 'unavailable'
      }
    });
  }
});

// Create a new ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const {
      issue_type,
      description,
      location,
      latitude,
      longitude,
      priority,
      reported_by
    } = req.body;

    if (!issue_type) {
      return res.status(400).json({
        success: false,
        message: 'Issue type is required'
      });
    }

    const result = await pool.query(
      `INSERT INTO tickets
       (issue_type, description, location, latitude, longitude, priority, reported_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        issue_type,
        description || null,
        location || null,
        latitude || null,
        longitude || null,
        priority || 'medium',
        reported_by || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket: result.rows[0]
    });

  } catch (error) {
    console.error('Create ticket error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to create ticket'
    });
  }
});

// Get all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.*,
        reporter.name AS reporter_name,
        worker.name AS worker_name
      FROM tickets t
      LEFT JOIN users reporter ON t.reported_by = reporter.id
      LEFT JOIN users worker ON t.assigned_to = worker.id
      ORDER BY t.created_at DESC
    `);

    res.json({
      success: true,
      tickets: result.rows
    });

  } catch (error) {
    console.error('Get tickets error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});