module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('evento', 'fecha_inicio_venta', {
      type: DataTypes.DATE,
      allowNull: true, // Permitimos null por si algún evento se vende al instante sin programar
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('evento', 'fecha_inicio_venta');
  },
};