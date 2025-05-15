module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('orden', {
      id_orden: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fecha_orden: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      monto_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      estado_pago: {
        type: DataTypes.ENUM('pendiente', 'pagado', 'fallido', 'reembolsado'),
        allowNull: false,
      },
      id_transaccion_pago: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metodo_pago: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('orden');
  },
};