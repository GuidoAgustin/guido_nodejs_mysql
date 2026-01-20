class DeleteEvento {
  constructor(eventosRepository) {
    this.$eventos = eventosRepository;
  }

  async execute({ evento_id }) {
    await this.$eventos.delete({
      evento_id,
    });

    return 'Evento deleted succesfully';
  }
}

module.exports = DeleteEvento;
