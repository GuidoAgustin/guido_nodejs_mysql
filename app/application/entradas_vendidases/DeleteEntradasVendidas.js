class DeleteEntradasVendidas {
  constructor(entradasVendidasesRepository) {
    this.$entradasVendidases = entradasVendidasesRepository;
  }

  async execute({ entradas_vendidas_id }) {
    await this.$entradasVendidases.delete({
      entradas_vendidas_id,
    });

    return 'EntradasVendidas deleted succesfully';
  }
}

module.exports = DeleteEntradasVendidas;
