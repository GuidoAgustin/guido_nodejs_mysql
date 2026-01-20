class GetTiposEntradasList {
  constructor(tiposEntradasRepository) {
    this.$tiposEntradas = tiposEntradasRepository;
  }

  async execute() {
    const tiposEntradas = await this.$tiposEntradas.list();

    return tiposEntradas;
  }
}

module.exports = GetTiposEntradasList;
