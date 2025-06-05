// backend/app/models/entradas_vendidas.model.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class entradas_vendidas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Una entrada vendida pertenece a una orden
      this.belongsTo(models.orden, { // Asegúrate que 'models.orden' sea el nombre correcto de tu modelo de orden
        foreignKey: 'id_orden',
        as: 'ordenInfo' // Alias opcional para la relación con la orden
      });

      // UNA ENTRADA VENDIDA PERTENECE A UN TIPO DE ENTRADA (ESTA ES LA ASOCIACIÓN CLAVE)
      this.belongsTo(models.tipos_entrada, { // Asegúrate que 'models.tipos_entrada' sea el nombre correcto
        foreignKey: 'id_tipo_entrada',
        as: 'tipoEntrada' // <<--- ESTE ALIAS DEBE COINCIDIR EXACTAMENTE CON EL USADO EN EL INCLUDE
      });
    }
  }
  entradas_vendidas.init(
    {
      id_entrada_vendida: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_orden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'orden', // Nombre de la TABLA
          key: 'id_orden',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_tipo_entrada: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tipos_entrada', // Nombre de la TABLA
          key: 'id_tipo_entrada',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      codigo_unico: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      estado_entrada: {
        type: DataTypes.ENUM('valida', 'utilizada', 'cancelada'),
        allowNull: false,
      },
      precio_pagado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      nombre_asistente: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email_asistente: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'entradas_vendidas',
      tableName: 'entradas_vendidas',
      timestamps: false,
    },
  );
  return entradas_vendidas;
};