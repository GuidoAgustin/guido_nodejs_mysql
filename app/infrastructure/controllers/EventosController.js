const { getResponseCustom } = require('../libs/serviceUtil');

class EventosController {
  constructor({
    getEventosList,
    showEvento,
    createEvento,
    updateEvento,
    deleteEvento,
  }) {
    this.name = 'eventosController';
    this.getEventosList = getEventosList;
    this.showEvento = showEvento;
    this.createEvento = createEvento;
    this.updateEvento = updateEvento;
    this.deleteEvento = deleteEvento;
  }

  async list(req, res, next) {
    try {
      const result = await this.getEventosList.execute();

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { evento_id } = req.params;

      const result = await this.showEvento.execute({
        evento_id,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { column_1, column_2 } = req.body;

      const result = await this.createEvento.execute({
        column_1,
        column_2,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { evento_id } = req.params;
      const { column_1, column_2 } = req.body;

      const result = await this.updateEvento.execute({
        evento_id,
        column_1,
        column_2,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { evento_id } = req.params;

      const result = await this.deleteEvento.execute({
        evento_id,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

}

module.exports = EventosController;
