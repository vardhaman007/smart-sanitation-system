import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not configured');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

try {
  console.log('Connecting to Render PostgreSQL...');

  const schemaSql = fs.readFileSync(
    path.join(__dirname, 'schema.sql'),
    'utf8'
  );

  await pool.query(schemaSql);
  console.log('Schema created successfully.');

  const seedSql = fs.readFileSync(
    path.join(__dirname, 'seed.sql'),
    'utf8'
  );

  await pool.query(seedSql);
  console.log('Seed data inserted successfully.');

  console.log('Database initialization complete.');
} finally {
  await pool.end();
}
