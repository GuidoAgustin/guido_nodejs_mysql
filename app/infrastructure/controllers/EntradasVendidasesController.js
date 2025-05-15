const { getResponseCustom } = require('../libs/serviceUtil');

class EntradasVendidasesController {
  constructor({
    getEntradasVendidasesList,
    showEntradasVendidas,
    createEntradasVendidas,
    updateEntradasVendidas,
    deleteEntradasVendidas,
  }) {
    this.name = 'entradasVendidasesController';
    this.getEntradasVendidasesList = getEntradasVendidasesList;
    this.showEntradasVendidas = showEntradasVendidas;
    this.createEntradasVendidas = createEntradasVendidas;
    this.updateEntradasVendidas = updateEntradasVendidas;
    this.deleteEntradasVendidas = deleteEntradasVendidas;
  }

  async list(req, res, next) {
    try {
      const result = await this.getEntradasVendidasesList.execute();

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { entradas_vendidas_id } = req.params;

      const result = await this.showEntradasVendidas.execute({
        entradas_vendidas_id,
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

      const result = await this.createEntradasVendidas.execute({
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
      const { entradas_vendidas_id } = req.params;
      const { column_1, column_2 } = req.body;

      const result = await this.updateEntradasVendidas.execute({
        entradas_vendidas_id,
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
      const { entradas_vendidas_id } = req.params;

      const result = await this.deleteEntradasVendidas.execute({
        entradas_vendidas_id,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

}

module.exports = EntradasVendidasesController;
