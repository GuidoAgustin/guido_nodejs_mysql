module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'user',
      [
        {
          first_name: 'General',
          last_name: 'Admin',
          email: 'admin@kmpus.io',
          password:
            '123456', // 123456
          rol: 'admin',
        },
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user', null, {});
  },
};
