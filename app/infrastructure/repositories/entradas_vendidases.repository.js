const { Op } = require('sequelize');const CustomError = require('../../domain/exceptions/CustomError');

class EntradasVendidasesRepository {
  constructor(models) {
    this.models = models;
  }

  async list() {
    const entradas_vendidases = await this.models.entradas_vendidas.findAll({
      order: [['name', 'asc']],
    });

    return entradas_vendidases;
  }

  async show({ entradas_vendidas_id }) {
    const entradas_vendidas = await this.models.entradas_vendidas.findByPk(entradas_vendidas_id);

    if (!entradas_vendidas) throw new CustomError('entradas_vendidas not found', 404);

    return entradas_vendidas;
  }

  async create({ column_1, column_2 }) {
    const entradas_vendidas = await this.models.entradas_vendidas.create({
      column_1, column_2,
    });

    return entradas_vendidas;
  }

  async update({ entradas_vendidas_id, column_1, column_2 }) {
    const entradas_vendidas = await this.models.entradas_vendidas.findByPk(entradas_vendidas_id);

    if (!entradas_vendidas) throw new CustomError('entradas_vendidas not found', 404);

    await entradas_vendidas.update({
      column_1,
      column_2,
    });

    return {
      ...entradas_vendidas.toJSON(),
      column_1,
      column_2,
    };
  }

  async delete({ entradas_vendidas_id }) {
    const entradas_vendidas = await this.models.entradas_vendidas.findByPk(entradas_vendidas_id);

    if (!entradas_vendidas) throw new CustomError('entradas_vendidas not found', 404);

    await entradas_vendidas.destroy();

    return entradas_vendidas;
  }
}

module.exports = EntradasVendidasesRepository;
