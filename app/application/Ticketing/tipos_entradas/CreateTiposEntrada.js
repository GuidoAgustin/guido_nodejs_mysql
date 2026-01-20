// backend/app/application/tipos_entradas/CreateTiposEntrada.js
class CreateTiposEntrada {
  constructor(tiposEntradasRepository) {
    this.$tiposEntradas = tiposEntradasRepository;
  }

  async execute({
    id_evento,
    nombre_tipo,
    precio,
    cantidad_total,
    cantidad_disponible,
    descripcion_adicional,
  }) {
    const tipo = await this.$tiposEntradas.create({
      id_evento,
      nombre_tipo,
      precio,
      cantidad_total,
      cantidad_disponible,
      descripcion_adicional,
    });
    return tipo;
  }
}

module.exports = CreateTiposEntrada;