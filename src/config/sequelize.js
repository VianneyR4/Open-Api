import { Sequelize } from 'sequelize'

const ssl = process.env.PGSSL === 'true'

const baseConfig = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
}

function buildFromEnv() {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, baseConfig)
  }
  return new Sequelize(
    process.env.PGDATABASE || 'kcaf_db',
    process.env.PGUSER || 'postgres',
    process.env.PGPASSWORD || null,
    {
      ...baseConfig,
      host: process.env.PGHOST || '127.0.0.1',
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    }
  )
}

export const sequelize = buildFromEnv()

export async function checkSequelizeConnection() {
  try {
    await sequelize.authenticate()
    console.log('✅ Sequelize connected')
  } catch (err) {
    console.error('❌ Sequelize connection failed:', err.message)
  }
}
