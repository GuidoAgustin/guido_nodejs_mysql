// backend/app/models/orden.model.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class orden extends Model {
    static associate(models) {
      this.belongsTo(models.user, { // Asume que tu modelo de usuario se llama 'user'
        foreignKey: 'id_usuario',
        as: 'comprador',
      });
      this.hasMany(models.entradas_vendidas, { // Asume que tu modelo de entradas vendidas es 'entradas_vendidas'
        foreignKey: 'id_orden',
        as: 'itemsDeOrden',
      });
    }
  }
  orden.init(
    {
      id_orden: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user', // Nombre de la TABLA de usuarios
          key: 'user_id',  // PK en la TABLA de usuarios
        },
        // onUpdate y onDelete ya los tenías bien
      },
      fecha_orden: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Para que se ponga la fecha actual al crear
      },
      monto_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      estado_pago: {
        type: DataTypes.ENUM('pendiente', 'pagado', 'fallido', 'reembolsado', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente', // Por defecto al crear una orden
      },
      id_transaccion_pago: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metodo_pago: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'orden', // Nombre del modelo
      tableName: 'orden', // Nombre de la tabla
      timestamps: false,
    },
  );
  return orden;
};