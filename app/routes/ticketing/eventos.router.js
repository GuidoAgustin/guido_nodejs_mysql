// backend/app/routes/eventos.router.js
const express = require("express");
// 👇 Agregamos adminMiddleware
const { authMiddleware, adminMiddleware } = require("../../infrastructure/middlewares/auth");
const { imageMiddleware } = require("../../infrastructure/middlewares/files");
const controllers = require("../../infrastructure/injectors");

const router = express.Router();

// 1) Listar eventos (PÚBLICO)
router.get("/", [], (req, res, next) => controllers.eventosController.list(req, res, next));

// 2) Crear evento (🔒 SOLO ADMIN)
router.post(
  "/",
  [authMiddleware, adminMiddleware, imageMiddleware.single("imagen")], // <-- Doble candado
  (req, res, next) => controllers.eventosController.create(req, res, next)
);

// 3) Detalle de evento (PÚBLICO)
router.get("/:evento_id", [], (req, res, next) => controllers.eventosController.show(req, res, next));

// 4) Actualizar evento (🔒 SOLO ADMIN)
router.put(
  "/:evento_id",
  [authMiddleware, adminMiddleware, imageMiddleware.single("imagen")], // <-- Doble candado
  (req, res, next) => controllers.eventosController.update(req, res, next)
);

// 5) Borrar evento (🔒 SOLO ADMIN)
router.delete("/:evento_id", [authMiddleware, adminMiddleware], (req, res, next) => // <-- Doble candado
  controllers.eventosController.delete(req, res, next)
);

// 6) Listar tipos de un evento (PÚBLICO)
router.get("/:evento_id/tipos", [], (req, res, next) => controllers.tiposEntradasController.list(req, res, next));

module.exports = { basePath: "/eventos", router };