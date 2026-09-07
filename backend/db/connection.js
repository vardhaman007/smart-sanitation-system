import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create connection configuration
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'sanitation_db',
      }
);

// Connection test and state flag
let isDbConnected = false;

export async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    isDbConnected = true;
    console.log('✅ PostgreSQL Database connected successfully at:', res.rows[0].now);
    return { connected: true, timestamp: res.rows[0].now };
  } catch (err) {
    isDbConnected = false;
    console.warn('⚠️  PostgreSQL connection warning:', err.message);
    console.warn('👉 Please ensure PostgreSQL is installed, running on port 5432, and the database is initialized.');
    return { connected: false, error: err.message };
  }
}

export function getDbStatus() {
  return isDbConnected;
}

// Wrapper for queries with friendly error messages
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    isDbConnected = true;
    return res;
  } catch (err) {
    // If connection refused or database down
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === '28P01' || err.code === '3D000') {
      isDbConnected = false;
      const customErr = new Error('Database unavailable. Please verify PostgreSQL service is running and configured.');
      customErr.status = 503;
      customErr.originalError = err.message;
      throw customErr;
    }
    throw err;
  }
}

export default {
  pool,
  query,
  testConnection,
  getDbStatus
};
