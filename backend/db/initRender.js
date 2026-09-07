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

const adminHash = '$2b$10$tfMA3DrDnqE1xSXcgk871O/ipmhhh6/WXLRvv.lOi1pK.ydH8ubWW';
const workerHash = '$2b$10$j.yCEKICtQy0w9yC9Hzv3uNaSkMC7YWX3lbJWAY1OTN3rpeNZUAjS';

try {
  console.log('Connecting to Render PostgreSQL...');

  const schemaSql = fs.readFileSync(
    path.join(__dirname, 'schema.sql'),
    'utf8'
  );

  await pool.query(schemaSql);
  console.log('Schema created successfully.');

  await pool.query(
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT'
  );

  const seedSql = fs.readFileSync(
    path.join(__dirname, 'seed.sql'),
    'utf8'
  );

  await pool.query(seedSql);
  console.log('Seed data inserted successfully.');

  await pool.query(
    'UPDATE users SET password_hash = $1 WHERE email = $2',
    [adminHash, 'admin@municipal.gov.in']
  );

  await pool.query(
    'UPDATE users SET password_hash = $1 WHERE email = $2',
    [workerHash, 'team01@municipal.gov.in']
  );

  console.log('Staff passwords configured successfully.');
  console.log('Database initialization complete.');
} finally {
  await pool.end();
}
