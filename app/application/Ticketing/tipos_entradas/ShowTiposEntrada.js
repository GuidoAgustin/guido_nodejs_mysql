class ShowTiposEntrada {
  constructor(tiposEntradasRepository) {
    this.$tiposEntradas = tiposEntradasRepository;
  }

  async execute({ tipos_entrada_id }) {
    const tiposEntrada = await this.$tiposEntradas.show({
      tipos_entrada_id,
    });

    return tiposEntrada;
  }
}

module.exports = ShowTiposEntrada;
