class UpdateTiposEntrada {
  constructor(tiposEntradasRepository) {
    this.$tiposEntradas = tiposEntradasRepository;
  }

  async execute({ tipos_entrada_id, column_1, column_2 }) {
    await this.$tiposEntradas.update({
      tipos_entrada_id, column_1, column_2,
    });

    return 'TiposEntrada updated succesfully';
  }
}

module.exports = UpdateTiposEntrada;
