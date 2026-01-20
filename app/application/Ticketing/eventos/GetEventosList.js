class GetEventosList {
  constructor(eventosRepository) {
    this.$eventos = eventosRepository;
  }

  async execute() {
    const eventos = await this.$eventos.list(); // Trae eventos + tipos_entrada

    const eventosConPrecioMinimo = eventos.map(evento => {
      const tipos = evento.tipos_entrada || [];
      const precios = tipos.map(t => parseFloat(t.precio));
      const precio_minimo = precios.length ? Math.min(...precios) : null;

      return {
        ...evento.toJSON(),
        precio_minimo
      };
    });

    return eventosConPrecioMinimo;
  }
}

module.exports = GetEventosList;
