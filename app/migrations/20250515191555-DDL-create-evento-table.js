module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('evento', {
      evento_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      nombre_evento: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fecha_hora_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fecha_hora_fin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lugar_nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lugar_direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoria: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imagen_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estado_evento: {
        type: DataTypes.ENUM('proximamente', 'disponible', 'agotado', 'pasado', 'cancelado'),
        allowNull: false,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('evento');
  },
};