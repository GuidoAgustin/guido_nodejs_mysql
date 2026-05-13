const express = require("express");
const router = express.Router();

// Importamos al Encargado (El Controlador del Patovica)
const EscanerController = require("../../infrastructure/controllers/adminTicketing/escaner.controller");

// El router recibe el código QR por POST y delega el trabajo al controlador
router.post("/admin/escaner/validar", EscanerController.validarTicket);

module.exports = {
  basePath: '/',
  router,
};