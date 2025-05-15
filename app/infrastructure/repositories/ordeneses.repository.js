const { Op } = require('sequelize');const CustomError = require('../../domain/exceptions/CustomError');

class OrdenesesRepository {
  constructor(models) {
    this.models = models;
  }

  async list() {
    const ordeneses = await this.models.ordenes.findAll({
      order: [['name', 'asc']],
    });

    return ordeneses;
  }

  async show({ ordenes_id }) {
    const ordenes = await this.models.ordenes.findByPk(ordenes_id);

    if (!ordenes) throw new CustomError('ordenes not found', 404);

    return ordenes;
  }

  async create({ column_1, column_2 }) {
    const ordenes = await this.models.ordenes.create({
      column_1, column_2,
    });

    return ordenes;
  }

  async update({ ordenes_id, column_1, column_2 }) {
    const ordenes = await this.models.ordenes.findByPk(ordenes_id);

    if (!ordenes) throw new CustomError('ordenes not found', 404);

    await ordenes.update({
      column_1,
      column_2,
    });

    return {
      ...ordenes.toJSON(),
      column_1,
      column_2,
    };
  }

  async delete({ ordenes_id }) {
    const ordenes = await this.models.ordenes.findByPk(ordenes_id);

    if (!ordenes) throw new CustomError('ordenes not found', 404);

    await ordenes.destroy();

    return ordenes;
  }
}

module.exports = OrdenesesRepository;
