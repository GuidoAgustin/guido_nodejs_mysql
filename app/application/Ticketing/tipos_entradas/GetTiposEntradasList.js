// backend/app/application/Ticketing/tipos_entradas/GetTiposEntradasList.js
class GetTiposEntradasList {
  constructor(tiposEntradasRepository) {
    this.$tiposEntradas = tiposEntradasRepository;
  }

  // Atajamos el parámetro que nos manda el controlador
  async execute({ id_evento } = {}) {
    // Se lo pasamos al repositorio para que filtre correctamente
    const tiposEntradas = await this.$tiposEntradas.list({ id_evento });
    return tiposEntradas;
  }
}

module.exports = GetTiposEntradasList;