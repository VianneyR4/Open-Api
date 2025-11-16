'use strict'

const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const BatimentImage = sequelize.define(
    'BatimentImage',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      batiment_id: { type: DataTypes.INTEGER, allowNull: false },
      filename: { type: DataTypes.STRING, allowNull: false },
      path: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: 'batiment_images',
      underscored: true,
    }
  )

  BatimentImage.associate = (models) => {
    BatimentImage.belongsTo(models.Batiment, { foreignKey: 'batiment_id' })
  }

  return BatimentImage
}
