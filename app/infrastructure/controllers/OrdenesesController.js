const { getResponseCustom } = require('../libs/serviceUtil');

class OrdenesesController {
  constructor({
    getOrdenesesList,
    showOrdenes,
    createOrdenes,
    updateOrdenes,
    deleteOrdenes,
  }) {
    this.name = 'ordenesesController';
    this.getOrdenesesList = getOrdenesesList;
    this.showOrdenes = showOrdenes;
    this.createOrdenes = createOrdenes;
    this.updateOrdenes = updateOrdenes;
    this.deleteOrdenes = deleteOrdenes;
  }

  async list(req, res, next) {
    try {
      const result = await this.getOrdenesesList.execute();

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { ordenes_id } = req.params;

      const result = await this.showOrdenes.execute({
        ordenes_id,
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

      const result = await this.createOrdenes.execute({
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
      const { ordenes_id } = req.params;
      const { column_1, column_2 } = req.body;

      const result = await this.updateOrdenes.execute({
        ordenes_id,
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
      const { ordenes_id } = req.params;

      const result = await this.deleteOrdenes.execute({
        ordenes_id,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

}

module.exports = OrdenesesController;
