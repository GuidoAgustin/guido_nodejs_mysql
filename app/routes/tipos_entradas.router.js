// backend/app/routes/tipos_entradas.router.js
const express = require("express");

const router = express.Router();
const controllers = require("../infrastructure/injectors");
const { authMiddleware } = require("../infrastructure/middlewares/auth");

// Listar todos los tipos (GET /tipos_entradas)
router.get("/", [], (req, res, next) =>
  controllers.tiposEntradasController.list(req, res, next)
);

// Crear un tipo (POST /tipos_entradas)
router.post("/", [authMiddleware], (req, res, next) =>
  controllers.tiposEntradasController.create(req, res, next)
);

// Detalle de un tipo (GET /tipos_entradas/:tipos_entrada_id)
router.get("/:tipos_entrada_id", [], (req, res, next) =>
  controllers.tiposEntradasController.show(req, res, next)
);

// Actualizar un tipo (PUT /tipos_entradas/:tipos_entrada_id)
router.put("/:tipos_entrada_id", [authMiddleware], (req, res, next) =>
  controllers.tiposEntradasController.update(req, res, next)
);

// Borrar un tipo (DELETE /tipos_entradas/:tipos_entrada_id)
router.delete("/:tipos_entrada_id", [authMiddleware], (req, res, next) =>
  controllers.tiposEntradasController.delete(req, res, next)
);

module.exports = {
  basePath: "/tipos_entradas",
  router,
};
