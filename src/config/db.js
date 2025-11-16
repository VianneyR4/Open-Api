import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
})

export async function checkDbConnection() {
  try {
    const res = await pool.query('SELECT 1 as ok')
    if (res?.rows?.[0]?.ok === 1) {
      console.log('✅ PostgreSQL connected')
    } else {
      console.warn('PostgreSQL check returned unexpected result')
    }
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message)
  }
}
