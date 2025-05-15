class DeleteOrdenes {
  constructor(ordenesesRepository) {
    this.$ordeneses = ordenesesRepository;
  }

  async execute({ ordenes_id }) {
    await this.$ordeneses.delete({
      ordenes_id,
    });

    return 'Ordenes deleted succesfully';
  }
}

module.exports = DeleteOrdenes;
