class GetTicketByCodigo {
  constructor(entradasVendidasesRepository) {
    this.$entradasVendidases = entradasVendidasesRepository;
  }

  async execute({ codigo_unico }) {
    // Va al repo y trae la entrada con sus relaciones
    return await this.$entradasVendidases.getByCodigoUnico(codigo_unico);
  }
}

module.exports = GetTicketByCodigo;