class CreateTiposEntrada {
  constructor(tiposEntradasRepository) {
    this.$tiposEntradas = tiposEntradasRepository;
  }

  async execute({ column_1, column_2 }) {
    await this.$tiposEntradas.create({
      column_1, column_2,
    });

    return 'TiposEntrada created succesfully';
  }
}

module.exports = CreateTiposEntrada;
