'use strict'

const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Batiment = sequelize.define(
    'Batiment',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: DataTypes.STRING },
      gref: { type: DataTypes.STRING },
      usage_principal: { type: DataTypes.STRING },
      proprietaire: { type: DataTypes.STRING },
      ville: { type: DataTypes.STRING },
      commune: { type: DataTypes.STRING },
      quartier: { type: DataTypes.STRING },
      avenue: { type: DataTypes.STRING },
      numero: { type: DataTypes.STRING },
      adresse: { type: DataTypes.STRING },
      superficie: { type: DataTypes.FLOAT },
      latitude: { type: DataTypes.FLOAT },
      longitude: { type: DataTypes.FLOAT },
      montant_loyer: { type: DataTypes.FLOAT },
      occupant: { type: DataTypes.STRING },
      nombre_appartements: { type: DataTypes.INTEGER },
      has_business: { type: DataTypes.BOOLEAN },
      type_business: { type: DataTypes.STRING },
      photo: { type: DataTypes.STRING },
      montant_a_payer: { type: DataTypes.FLOAT },
      survey_status: { type: DataTypes.STRING },
      progression: { type: DataTypes.STRING },
      statut: { type: DataTypes.STRING },
      collecteur_id: { type: DataTypes.INTEGER },
      zone_id: { type: DataTypes.INTEGER },
    },
    {
      tableName: 'batiments',
      underscored: true,
    }
  )

  Batiment.associate = (models) => {
    Batiment.belongsTo(models.Zone, { foreignKey: 'zone_id' })
    Batiment.belongsTo(models.Collecteur, { foreignKey: 'collecteur_id' })
    Batiment.hasMany(models.BatimentImage, { foreignKey: 'batiment_id', as: 'images' })
  }

  return Batiment
}
