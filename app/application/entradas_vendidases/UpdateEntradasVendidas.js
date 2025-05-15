class UpdateEntradasVendidas {
  constructor(entradasVendidasesRepository) {
    this.$entradasVendidases = entradasVendidasesRepository;
  }

  async execute({ entradas_vendidas_id, column_1, column_2 }) {
    await this.$entradasVendidases.update({
      entradas_vendidas_id, column_1, column_2,
    });

    return 'EntradasVendidas updated succesfully';
  }
}

module.exports = UpdateEntradasVendidas;
