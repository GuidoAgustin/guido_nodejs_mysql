module.exports = {
    up: async (queryInterface, DataTypes) => {
      await queryInterface.addColumn('user', 'rol', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'cliente', // Cambia el valor por defecto si lo deseas
      });
    },
    down: async (queryInterface) => {
      await queryInterface.removeColumn('user', 'rol');
    },
  };