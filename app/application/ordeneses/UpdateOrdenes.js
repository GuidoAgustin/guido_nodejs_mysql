class UpdateOrdenes {
  constructor(ordenesesRepository) {
    this.$ordeneses = ordenesesRepository;
  }

  async execute({ ordenes_id, column_1, column_2 }) {
    await this.$ordeneses.update({
      ordenes_id, column_1, column_2,
    });

    return 'Ordenes updated succesfully';
  }
}

module.exports = UpdateOrdenes;
