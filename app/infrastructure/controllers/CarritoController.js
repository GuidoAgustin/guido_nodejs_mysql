const { getResponseCustom } = require('../libs/serviceUtil');

class CarritoController {
  constructor({ getMisCompras }) {
    this.name = 'carritoController';
    this.getMisCompras = getMisCompras;
  }

  async getEntradasActivas(req, res, next) {
    try {
      const user_id = req.user.user_id || req.user.id;
      const result = await this.getMisCompras.executeEntradasActivas({ user_id });
      res.status(200).send(getResponseCustom(200, result));
    } catch (error) { next(error); }
  }

  async getTiendaActiva(req, res, next) {
    try {
      const user_id = req.user.user_id || req.user.id;
      const result = await this.getMisCompras.executeTiendaActiva({ user_id });
      res.status(200).send(getResponseCustom(200, result));
    } catch (error) { next(error); }
  }

  async getHistorial(req, res, next) {
    try {
      const user_id = req.user.user_id || req.user.id;
      const result = await this.getMisCompras.executeHistorial({ user_id });
      res.status(200).send(getResponseCustom(200, result));
    } catch (error) { next(error); }
  }
}

module.exports = CarritoController;