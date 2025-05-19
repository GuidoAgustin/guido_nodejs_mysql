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
    estado_evento
  }) {
    // delega al repositorio, usando los campos reales
    const evento = await this.$eventos.create({
      nombre_evento,
      descripcion,
      fecha_hora_inicio,
      fecha_hora_fin,
      lugar_nombre,
      lugar_direccion,
      categoria,
      imagen_url,
      estado_evento
    });
    return evento;
  }
}

module.exports = CreateEvento;