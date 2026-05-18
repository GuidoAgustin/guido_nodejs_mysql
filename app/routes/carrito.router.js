const express = require('express');

const router = express.Router();
const controllers = require('../infrastructure/injectors');

// 🛡️ IMPORTAMOS LA SEGURIDAD
const { authMiddleware } = require('../infrastructure/middlewares/auth'); 

// 🎟️ 1. Ruta para Entradas Activas y Pendientes de pago
router.get(
  '/carrito/entradas-activas',
  [authMiddleware], 
  (req, res, next) => controllers.carritoController.getEntradasActivas(req, res, next),
);

// 🛍️ 2. Ruta para la Tienda Activa (E-commerce)
router.get(
  '/carrito/tienda-activa',
  [authMiddleware], 
  (req, res, next) => controllers.carritoController.getTiendaActiva(req, res, next),
);

// 📜 3. Ruta para el Historial (Entradas utilizadas/canceladas y pedidos entregados)
router.get(
  '/carrito/historial',
  [authMiddleware], 
  (req, res, next) => controllers.carritoController.getHistorial(req, res, next),
);

module.exports = {
  basePath: '/', 
  router,
};