class ShowEntradasVendidas {
  constructor(entradasVendidasesRepository) {
    this.$entradasVendidases = entradasVendidasesRepository;
  }

  async execute({ entradas_vendidas_id }) {
    const entradasVendidas = await this.$entradasVendidases.show({
      entradas_vendidas_id,
    });

    return entradasVendidas;
  }
}

module.exports = ShowEntradasVendidas;
