// backend/app/routes/eventos.router.js
const express = require("express");
const { authMiddleware } = require("../../infrastructure/middlewares/auth");
const { imageMiddleware } = require("../../infrastructure/middlewares/files");
const controllers = require("../../infrastructure/injectors");

const router = express.Router();

// 1) Listar eventos
router.get("/", [], (req, res, next) =>
  controllers.eventosController.list(req, res, next)
);

// 2) Crear evento con imagen (campo 'imagen')
router.post(
  "/",
  [authMiddleware, imageMiddleware.single("imagen")],
  (req, res, next) => controllers.eventosController.create(req, res, next)
);

// 3) Detalle de evento
router.get("/:evento_id", [], (req, res, next) =>
  controllers.eventosController.show(req, res, next)
);

// 4) Actualizar evento, opcionalmente reemplazando imagen
router.put(
  "/:evento_id",
  [ authMiddleware, imageMiddleware.single("imagen")],
  (req, res, next) => controllers.eventosController.update(req, res, next)
);

// 5) Borrar evento
router.delete("/:evento_id", [authMiddleware], (req, res, next) =>
  controllers.eventosController.delete(req, res, next)
);

// 6) Listar tipos de un evento
router.get("/:evento_id/tipos", [], (req, res, next) =>
  controllers.tiposEntradasController.list(req, res, next)
);

module.exports = {
  basePath: "/eventos",
  router,
};
