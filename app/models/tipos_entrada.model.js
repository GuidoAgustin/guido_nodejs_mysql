const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class tipos_entrada extends Model {}
  tipos_entrada.init(
    {
      id_tipo_entrada: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_evento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'evento',
          key: 'evento_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nombre_tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      cantidad_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cantidad_disponible: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      descripcion_adicional: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'tipos_entrada',
      tableName: 'tipos_entrada',
      timestamps: false,
    },
  );
  return tipos_entrada;
};