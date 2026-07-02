const express = require("express");
const router = express.Router();
// 👇 Importamos al Patovica VIP
const { authMiddleware, adminMiddleware } = require("../../infrastructure/middlewares/auth");
const controllers = require("../../infrastructure/injectors");

// 🔒 SOLO ADMIN: Ver todas las órdenes del sistema
router.get("/", [authMiddleware, adminMiddleware], (req, res, next) =>
  controllers.ordenesesController.list(req, res, next)
);

// 🟢 CLIENTES: Crear una compra (Solo requiere estar logueado)
router.post("/", [authMiddleware], (req, res, next) =>
  controllers.ordenesesController.create(req, res, next)
);

// 🔒 SOLO ADMIN: Ver el detalle de cualquier orden del sistema
router.get("/:ordenes_id", [authMiddleware, adminMiddleware], (req, res, next) =>
  controllers.ordenesesController.show(req, res, next)
);

// 🔒 SOLO ADMIN: Eliminar una orden de la base de datos
router.delete("/:ordenes_id", [authMiddleware, adminMiddleware], (req, res, next) =>
  controllers.ordenesesController.delete(req, res, next)
);

module.exports = { basePath: "/ordenes", router };