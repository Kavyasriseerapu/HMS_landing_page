import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const migrationPath = path.resolve(__dirname, '../migrations/001_demo_requests.sql');
  console.log(`Reading migration from: ${migrationPath}`);
  let sql = fs.readFileSync(migrationPath, 'utf8');
  // Strip BOM if present
  sql = sql.replace(/^\uFEFF/, '');

  const client = await pool.connect();
  try {
    console.log('Running migration on database...');
    await client.query(sql);
    console.log('Migration 001_demo_requests.sql executed successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
