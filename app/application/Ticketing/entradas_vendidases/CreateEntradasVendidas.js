class CreateEntradasVendidas {
  constructor(entradasVendidasesRepository) {
    this.$entradasVendidases = entradasVendidasesRepository;
  }

  async execute({ column_1, column_2 }) {
    await this.$entradasVendidases.create({
      column_1, column_2,
    });

    return 'EntradasVendidas created succesfully';
  }
}

module.exports = CreateEntradasVendidas;
