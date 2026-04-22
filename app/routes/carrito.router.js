const express = require('express');

const router = express.Router();
const controllers = require('../infrastructure/injectors');

// 👇 1. DESCOMENTAMOS ESTA LÍNEA PARA IMPORTAR LA SEGURIDAD 👇
const { authMiddleware } = require('../infrastructure/middlewares/auth'); 

router.get(
  '/carrito/mis-compras',
  // 👇 2. LE AGREGAMOS LA SEGURIDAD A LA RUTA 👇
  [authMiddleware], 
  (req, res, next) => controllers.carritoController.getCarrito(req, res, next),
);

module.exports = {
  basePath: '/', 
  router,
};