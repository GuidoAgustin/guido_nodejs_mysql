module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('tipos_entrada', {
      id_tipo_entrada: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
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
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('tipos_entrada');
  },
};