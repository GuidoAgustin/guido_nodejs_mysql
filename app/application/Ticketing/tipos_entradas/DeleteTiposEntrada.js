class DeleteTiposEntrada {
  constructor(tiposEntradasRepository) {
    this.$tiposEntradas = tiposEntradasRepository;
  }

  async execute({ tipos_entrada_id }) {
    await this.$tiposEntradas.delete({
      tipos_entrada_id,
    });

    return 'TiposEntrada deleted succesfully';
  }
}

module.exports = DeleteTiposEntrada;
