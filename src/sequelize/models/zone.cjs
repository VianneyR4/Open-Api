'use strict'

const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Zone = sequelize.define(
    'Zone',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      lots: { type: DataTypes.STRING },
      latitude: { type: DataTypes.FLOAT },
      longitude: { type: DataTypes.FLOAT },
    },
    {
      tableName: 'zones',
      underscored: true,
    }
  )

  Zone.associate = (models) => {
    Zone.hasMany(models.Collecteur, { foreignKey: 'zone_id' })
    Zone.hasMany(models.Batiment, { foreignKey: 'zone_id' })
  }

  return Zone
}
