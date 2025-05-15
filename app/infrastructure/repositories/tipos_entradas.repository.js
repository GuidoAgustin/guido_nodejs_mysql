const { Op } = require('sequelize');const CustomError = require('../../domain/exceptions/CustomError');

class TiposEntradasRepository {
  constructor(models) {
    this.models = models;
  }

  async list() {
    const tipos_entradas = await this.models.tipos_entrada.findAll({
      order: [['name', 'asc']],
    });

    return tipos_entradas;
  }

  async show({ tipos_entrada_id }) {
    const tipos_entrada = await this.models.tipos_entrada.findByPk(tipos_entrada_id);

    if (!tipos_entrada) throw new CustomError('tipos_entrada not found', 404);

    return tipos_entrada;
  }

  async create({ column_1, column_2 }) {
    const tipos_entrada = await this.models.tipos_entrada.create({
      column_1, column_2,
    });

    return tipos_entrada;
  }

  async update({ tipos_entrada_id, column_1, column_2 }) {
    const tipos_entrada = await this.models.tipos_entrada.findByPk(tipos_entrada_id);

    if (!tipos_entrada) throw new CustomError('tipos_entrada not found', 404);

    await tipos_entrada.update({
      column_1,
      column_2,
    });

    return {
      ...tipos_entrada.toJSON(),
      column_1,
      column_2,
    };
  }

  async delete({ tipos_entrada_id }) {
    const tipos_entrada = await this.models.tipos_entrada.findByPk(tipos_entrada_id);

    if (!tipos_entrada) throw new CustomError('tipos_entrada not found', 404);

    await tipos_entrada.destroy();

    return tipos_entrada;
  }
}

module.exports = TiposEntradasRepository;
