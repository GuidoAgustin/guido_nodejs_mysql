class GetEntradasVendidasesList {
  constructor(entradasVendidasesRepository) {
    this.$entradasVendidases = entradasVendidasesRepository;
  }

  async execute() {
    const entradasVendidases = await this.$entradasVendidases.list();

    return entradasVendidases;
  }
}

module.exports = GetEntradasVendidasesList;
