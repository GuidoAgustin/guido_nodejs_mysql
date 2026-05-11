const express = require("express");
const router = express.Router();
// Importamos al Encargado
const ReportesController = require("../../infrastructure/controllers/adminTicketing/reportes.controller");

// El router solo delega el trabajo al controlador. ¡Arquitectura limpia pura!
router.get("/admin/reportes", ReportesController.getReportesDashboard);

module.exports = {
  basePath: '/',
  router,
};
