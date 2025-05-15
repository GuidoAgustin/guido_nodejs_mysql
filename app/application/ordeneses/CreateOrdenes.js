class CreateOrdenes {
  constructor(ordenesesRepository) {
    this.$ordeneses = ordenesesRepository;
  }

  async execute({ column_1, column_2 }) {
    await this.$ordeneses.create({
      column_1, column_2,
    });

    return 'Ordenes created succesfully';
  }
}

module.exports = CreateOrdenes;
