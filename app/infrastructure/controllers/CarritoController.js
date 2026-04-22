const { getResponseCustom } = require('../libs/serviceUtil'); // Mantenemos el import que habías arreglado

class CarritoController {
  constructor({ getMisCompras }) {
    this.name = 'carritoController';
    this.getMisCompras = getMisCompras;
  }

  async getCarrito(req, res, next) {
    try {
      // 👇 EL ARREGLO MÁGICO ESTÁ ACÁ 👇
      const user_id = req.user.user_id || req.user.id;

      const result = await this.getMisCompras.execute({ user_id });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CarritoController;