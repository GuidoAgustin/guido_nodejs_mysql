class ShowEvento {
  constructor(eventosRepository) {
    this.$eventos = eventosRepository;
  }

  async execute({ evento_id }) {
    const evento = await this.$eventos.show({
      evento_id,
    });

    return evento;
  }
}

module.exports = ShowEvento;
