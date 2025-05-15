const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class entradas_vendidas extends Model {}
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
          model: 'orden',
          key: 'id_orden',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_tipo_entrada: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tipos_entrada',
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