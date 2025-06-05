// backend/app/infrastructure/controllers/OrdenesesController.js
const { getResponseCustom } = require("../libs/serviceUtil");
const CustomError = require("../../domain/exceptions/CustomError");

class OrdenesesController {
  constructor({
    getOrdenesesList,
    showOrdenes,
    createOrdenes,
    updateOrdenes,
    deleteOrdenes,
  }) {
    this.name = "ordenesesController";
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
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { ordenes_id } = req.params;
      const result = await this.showOrdenes.execute({ ordenes_id });
      res.status(200).send(getResponseCustom(200, result));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      // Obtener datos del usuario desde el token (inyectado por authMiddleware)
      const usuarioAutenticado = req.user;
      if (!usuarioAutenticado || !usuarioAutenticado.user_id) {
        return res
          .status(401)
          .send(getResponseCustom(401, null, "Usuario no autenticado."));
      }

      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .send(
            getResponseCustom(
              400,
              null,
              "Se requiere un array de items para crear la orden."
            )
          );
      }

      // Pasar los detalles del comprador al servicio para que se guarden en las entradas
      const result = await this.createOrdenes.execute({
        id_usuario: usuarioAutenticado.user_id,
        nombre_comprador:
          usuarioAutenticado.nombre ||
          `${usuarioAutenticado.first_name || ""} ${
            usuarioAutenticado.last_name || ""
          }`.trim(),
        email_comprador: usuarioAutenticado.email,
        items,
      });

      return res
        .status(201)
        .send(getResponseCustom(201, result, "Orden iniciada correctamente."));
    } catch (error) {
      if (error instanceof CustomError) {
        return res
          .status(error.statusCode || 500)
          .send(
            getResponseCustom(error.statusCode || 500, null, error.message)
          );
      }
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { ordenes_id } = req.params;
      const datosAActualizar = req.body;

      const result = await this.updateOrdenes.execute({
        ordenes_id,
        datosParaActualizar: datosAActualizar,
      });
      res.status(200).send(getResponseCustom(200, result));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { ordenes_id } = req.params;
      const result = await this.deleteOrdenes.execute({ ordenes_id });
      res.status(200).send(getResponseCustom(200, result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrdenesesController;
