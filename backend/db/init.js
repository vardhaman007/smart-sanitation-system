import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Client, Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbName = process.env.DB_NAME || 'sanitation_db';

async function initDatabase() {
  console.log('================================================================');
  console.log('  Sanitation App - PostgreSQL Database Initialization Script');
  console.log('================================================================');
  console.log(`Connecting to PostgreSQL host: ${dbHost}:${dbPort} as user: ${dbUser}...`);

  // Step 1: Connect to default postgres maintenance database to create target DB if needed
  const adminClient = new Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres'
  });

  try {
    await adminClient.connect();
    console.log('Connected to PostgreSQL root server.');

    const checkDbRes = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDbRes.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating it now...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL server:', err.message);
    console.error('\n👉 Please make sure PostgreSQL is installed and running on your system.');
    console.error('👉 If you use a custom password or username, update backend/.env.');
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // Step 2: Connect to sanitation_db and run schema.sql & seed.sql
  const targetPool = new Pool({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbName
  });

  try {
    console.log(`Applying schema to "${dbName}"...`);
    const schemaSqlPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    await targetPool.query(schemaSql);
    console.log('✅ Schema tables created (users, tickets, ticket_history).');

    console.log(`Applying seed data to "${dbName}"...`);
    const seedSqlPath = path.join(__dirname, 'seed.sql');
    const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
    await targetPool.query(seedSql);
    console.log('✅ Seed records inserted successfully.');

    // Count records
    const userCount = await targetPool.query('SELECT COUNT(*) FROM users');
    const ticketCount = await targetPool.query('SELECT COUNT(*) FROM tickets');
    console.log(`\n🎉 Database initialized successfully!`);
    console.log(`📊 Users in database: ${userCount.rows[0].count}`);
    console.log(`📊 Tickets in database: ${ticketCount.rows[0].count}`);
  } catch (err) {
    console.error('❌ Error executing schema or seed SQL:', err.message);
    process.exit(1);
  } finally {
    await targetPool.end();
  }
}

initDatabase();
