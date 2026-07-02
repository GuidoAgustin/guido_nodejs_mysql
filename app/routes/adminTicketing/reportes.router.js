const express = require("express");
const router = express.Router();
const ReportesController = require("../../infrastructure/controllers/adminTicketing/reportes.controller");
// 🛡️ IMPORTAMOS LA SEGURIDAD
const { authMiddleware, adminMiddleware } = require("../../infrastructure/middlewares/auth");

// 🔥 DOBLE CANDADO ACTIVADO
router.get("/admin/reportes", [authMiddleware, adminMiddleware], ReportesController.getReportesDashboard);

module.exports = { basePath: '/', router };