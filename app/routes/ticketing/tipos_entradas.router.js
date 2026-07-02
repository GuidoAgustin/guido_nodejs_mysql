// backend/app/routes/tipos_entradas.router.js
const express = require("express");
const router = express.Router();
const controllers = require("../../infrastructure/injectors");
// 👇 Agregamos adminMiddleware
const { authMiddleware, adminMiddleware } = require("../../infrastructure/middlewares/auth");

// Listar todos los tipos (PÚBLICO)
router.get("/", [], (req, res, next) => controllers.tiposEntradasController.list(req, res, next));

// Crear un tipo (🔒 SOLO ADMIN)
router.post("/", [authMiddleware, adminMiddleware], (req, res, next) => // <-- Doble candado
  controllers.tiposEntradasController.create(req, res, next)
);

// Detalle de un tipo (PÚBLICO)
router.get("/:tipos_entrada_id", [], (req, res, next) => controllers.tiposEntradasController.show(req, res, next));

// Actualizar un tipo (🔒 SOLO ADMIN)
router.put("/:tipos_entrada_id", [authMiddleware, adminMiddleware], (req, res, next) => // <-- Doble candado
  controllers.tiposEntradasController.update(req, res, next)
);

// Borrar un tipo (🔒 SOLO ADMIN)
router.delete("/:tipos_entrada_id", [authMiddleware, adminMiddleware], (req, res, next) => // <-- Doble candado
  controllers.tiposEntradasController.delete(req, res, next)
);

module.exports = { basePath: "/tipos_entradas", router };