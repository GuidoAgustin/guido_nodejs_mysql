module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('entradas_vendidas', {
      id_entrada_vendida: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
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
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('entradas_vendidas');
  },
};