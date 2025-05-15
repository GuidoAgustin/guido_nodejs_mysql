class UpdateEvento {
  constructor(eventosRepository) {
    this.$eventos = eventosRepository;
  }

  async execute({ evento_id, column_1, column_2 }) {
    await this.$eventos.update({
      evento_id, column_1, column_2,
    });

    return 'Evento updated succesfully';
  }
}

module.exports = UpdateEvento;
