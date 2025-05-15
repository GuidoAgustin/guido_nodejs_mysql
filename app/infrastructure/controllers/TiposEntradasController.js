const { getResponseCustom } = require('../libs/serviceUtil');

class TiposEntradasController {
  constructor({
    getTiposEntradasList,
    showTiposEntrada,
    createTiposEntrada,
    updateTiposEntrada,
    deleteTiposEntrada,
  }) {
    this.name = 'tiposEntradasController';
    this.getTiposEntradasList = getTiposEntradasList;
    this.showTiposEntrada = showTiposEntrada;
    this.createTiposEntrada = createTiposEntrada;
    this.updateTiposEntrada = updateTiposEntrada;
    this.deleteTiposEntrada = deleteTiposEntrada;
  }

  async list(req, res, next) {
    try {
      const result = await this.getTiposEntradasList.execute();

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { tipos_entrada_id } = req.params;

      const result = await this.showTiposEntrada.execute({
        tipos_entrada_id,
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

      const result = await this.createTiposEntrada.execute({
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
      const { tipos_entrada_id } = req.params;
      const { column_1, column_2 } = req.body;

      const result = await this.updateTiposEntrada.execute({
        tipos_entrada_id,
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
      const { tipos_entrada_id } = req.params;

      const result = await this.deleteTiposEntrada.execute({
        tipos_entrada_id,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

}

module.exports = TiposEntradasController;
