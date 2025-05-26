const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Evento extends Model {
    static associate(models) {
      this.hasMany(models.tipos_entrada, {
        as: 'tipos_entrada',
        foreignKey: 'id_evento',
        onDelete: 'CASCADE',          // <-- cascada
        hooks: true                   // <-- importante para que funcione
      });
    }
  }
  Evento.init(
    {
      evento_id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
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
    },
    {
      sequelize,
      modelName: 'evento',
      tableName: 'evento',
      timestamps: false,
    },
  );
  return Evento;
};