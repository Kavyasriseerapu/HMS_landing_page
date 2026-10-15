import pg from 'pg';

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL || '';
const isSslRequired =
  isProduction ||
  connectionString.includes('sslmode=require') ||
  connectionString.includes('neon.tech') ||
  connectionString.includes('supabase') ||
  process.env.PGSSL === 'true';

if (!connectionString) {
  console.warn('WARNING: DATABASE_URL environment variable is not defined.');
}

export const pool = new Pool({
  connectionString,
  ssl: isSslRequired ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});
