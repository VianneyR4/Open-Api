/* eslint-disable */
'use strict'

const fs = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')
require('dotenv').config()

const basename = path.basename(__filename)
const db = {}

const ssl = process.env.PGSSL === 'true'
const baseConfig = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: ssl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
}

let sequelize
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, baseConfig)
} else {
  sequelize = new Sequelize(
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

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.endsWith('.js') || file.endsWith('.cjs'))
    )
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize)
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

db.Sequelize = Sequelize

module.exports = db
