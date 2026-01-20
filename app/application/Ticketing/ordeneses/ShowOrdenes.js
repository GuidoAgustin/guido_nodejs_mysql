class ShowOrdenes {
  constructor(ordenesesRepository) {
    this.$ordeneses = ordenesesRepository;
  }

  async execute({ ordenes_id }) {
    const ordenes = await this.$ordeneses.show({
      ordenes_id,
    });

    return ordenes;
  }
}

module.exports = ShowOrdenes;
