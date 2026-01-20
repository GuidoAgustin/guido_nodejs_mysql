class GetOrdenesesList {
  constructor(ordenesesRepository) {
    this.$ordeneses = ordenesesRepository;
  }

  async execute() {
    const ordeneses = await this.$ordeneses.list();

    return ordeneses;
  }
}

module.exports = GetOrdenesesList;
