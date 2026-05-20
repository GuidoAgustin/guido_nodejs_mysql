module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('evento', 'vender_durante_evento', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('evento', 'vender_durante_evento');
  },
};