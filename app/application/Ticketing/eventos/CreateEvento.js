class CreateEvento {
  constructor(eventosRepository) {
    this.$eventos = eventosRepository;
  }

  async execute({
    nombre_evento,
    descripcion,
    fecha_hora_inicio,
    fecha_hora_fin,
    lugar_nombre,
    lugar_direccion,
    categoria,
    imagen_url,
    estado_evento,
    vender_durante_evento // <-- NUEVO
  }) {
    const evento = await this.$eventos.create({
      nombre_evento,
      descripcion,
      fecha_hora_inicio,
      fecha_hora_fin,
      lugar_nombre,
      lugar_direccion,
      categoria,
      imagen_url,
      estado_evento,
      vender_durante_evento // <-- NUEVO
    });
    return evento;
  }
}

module.exports = CreateEvento;