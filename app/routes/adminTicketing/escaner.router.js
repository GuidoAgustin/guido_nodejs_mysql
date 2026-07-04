const express = require("express");
const router = express.Router();
const EscanerController = require("../../infrastructure/controllers/adminTicketing/escaner.controller");
// 🛡️ IMPORTAMOS LA SEGURIDAD
const { authMiddleware, adminMiddleware, staffMiddleware } = require("../../infrastructure/middlewares/auth");

// 🔥 DOBLE CANDADO ACTIVADO (Solo los admins/staff pueden escanear)
router.post("/admin/escaner/validar", [authMiddleware, adminMiddleware, staffMiddleware], EscanerController.validarTicket);

module.exports = { basePath: '/', router };