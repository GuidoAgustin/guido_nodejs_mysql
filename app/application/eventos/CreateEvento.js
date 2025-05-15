class CreateEvento {
  constructor(eventosRepository) {
    this.$eventos = eventosRepository;
  }

  async execute({ column_1, column_2 }) {
    await this.$eventos.create({
      column_1, column_2,
    });

    return 'Evento created succesfully';
  }
}

module.exports = CreateEvento;
