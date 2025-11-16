'use strict'

const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Collecteur = sequelize.define(
    'Collecteur',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING },
      numero_collecteur: { type: DataTypes.STRING, unique: true },
      zone_id: { type: DataTypes.INTEGER, allowNull: false },
      lot: { type: DataTypes.STRING },
      batiments_total: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
      batiments_validee: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
      statut: { type: DataTypes.STRING },
      batiments_total: { type: DataTypes.INTEGER, defaultValue: 0 },
      batiments_validee: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      tableName: 'collecteurs',
      underscored: true,
    }
  )

  Collecteur.associate = (models) => {
    Collecteur.belongsTo(models.Zone, { foreignKey: 'zone_id' })
    Collecteur.hasMany(models.Batiment, { foreignKey: 'collecteur_id' })
  }

  return Collecteur
}
