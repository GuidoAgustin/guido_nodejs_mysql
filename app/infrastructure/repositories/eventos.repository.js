const { Op } = require('sequelize');const CustomError = require('../../domain/exceptions/CustomError');

class EventosRepository {
  constructor(models) {
    this.models = models;
  }

  async list() {
    const eventos = await this.models.evento.findAll({
      order: [['name', 'asc']],
    });

    return eventos;
  }

  async show({ evento_id }) {
    const evento = await this.models.evento.findByPk(evento_id);

    if (!evento) throw new CustomError('evento not found', 404);

    return evento;
  }

  async create({ column_1, column_2 }) {
    const evento = await this.models.evento.create({
      column_1, column_2,
    });

    return evento;
  }

  async update({ evento_id, column_1, column_2 }) {
    const evento = await this.models.evento.findByPk(evento_id);

    if (!evento) throw new CustomError('evento not found', 404);

    await evento.update({
      column_1,
      column_2,
    });

    return {
      ...evento.toJSON(),
      column_1,
      column_2,
    };
  }

  async delete({ evento_id }) {
    const evento = await this.models.evento.findByPk(evento_id);

    if (!evento) throw new CustomError('evento not found', 404);

    await evento.destroy();

    return evento;
  }
}

module.exports = EventosRepository;
