const { getResponseCustom } = require('../libs/serviceUtil');

class TiposEntradasController {
  constructor({
    getTiposEntradasList,
    showTiposEntrada,
    createTiposEntrada,
    updateTiposEntrada,
    deleteTiposEntrada,
  }) {
    this.getTiposEntradasList = getTiposEntradasList;
    this.showTiposEntrada     = showTiposEntrada;
    this.createTiposEntrada   = createTiposEntrada;
    this.updateTiposEntrada   = updateTiposEntrada;
    this.deleteTiposEntrada   = deleteTiposEntrada;
  }

  // GET /tipos_entradas or /eventos/:evento_id/tipos
  async list(req, res, next) {
    try {
      const id_evento = req.params.evento_id ?? null;
      const result = await this.getTiposEntradasList.execute({ id_evento });
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  // GET /tipos_entradas/:tipos_entrada_id
  async show(req, res, next) {
    try {
      const { tipos_entrada_id } = req.params;
      const result = await this.showTiposEntrada.execute({ tipos_entrada_id });
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  // POST /tipos_entradas
  async create(req, res, next) {
    try {
      const payload = {
        id_evento:           req.body.id_evento,
        nombre_tipo:         req.body.nombre_tipo,
        precio:              req.body.precio,
        cantidad_total:      req.body.cantidad_total,
        cantidad_disponible: req.body.cantidad_disponible,
        descripcion_adicional: req.body.descripcion_adicional,
      };
      const result = await this.createTiposEntrada.execute(payload);
      res.status(201).send(getResponseCustom(201, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  // PUT /tipos_entradas/:tipos_entrada_id
  async update(req, res, next) {
    try {
      const { tipos_entrada_id } = req.params;
      const payload = {
        tipos_entrada_id,
        nombre_tipo:         req.body.nombre_tipo,
        precio:              req.body.precio,
        cantidad_total:      req.body.cantidad_total,
        cantidad_disponible: req.body.cantidad_disponible,
        descripcion_adicional: req.body.descripcion_adicional,
      };
      const result = await this.updateTiposEntrada.execute(payload);
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  // DELETE /tipos_entradas/:tipos_entrada_id
  async delete(req, res, next) {
    try {
      const { tipos_entrada_id } = req.params;
      const result = await this.deleteTiposEntrada.execute({ tipos_entrada_id });
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TiposEntradasController;
