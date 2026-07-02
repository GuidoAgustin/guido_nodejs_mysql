const express = require("express");
const router = express.Router();
// 👇 Importamos al Patovica VIP
const { authMiddleware, adminMiddleware } = require("../../infrastructure/middlewares/auth");
const controllers = require("../../infrastructure/injectors");

// 🟢 PÚBLICO: Descargar el ticket usando el código secreto único
router.get("/ticket/:codigo_unico", (req, res, next) => {
  controllers.entradasVendidasesController.downloadTicket(req, res, next);
});

// 🔒 SOLO ADMIN: Listar todas las entradas del sistema
router.get("/", [authMiddleware, adminMiddleware], (req, res, next) =>
  controllers.entradasVendidasesController.index(req, res, next) 
);

// 🔒 SOLO ADMIN: Ver el detalle técnico de una entrada en particular
router.get("/:entradas_vendidas_id", [authMiddleware, adminMiddleware], (req, res, next) =>
  controllers.entradasVendidasesController.show(req, res, next)
);

module.exports = { basePath: "/entradas_vendidases", router };