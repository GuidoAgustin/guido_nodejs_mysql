class GetEventosList {
  constructor(eventosRepository) {
    this.$eventos = eventosRepository;
  }

  async execute() {
    const eventos = await this.$eventos.list();

    return eventos;
  }
}

module.exports = GetEventosList;
