const express = require("express");
const router = express.Router();
const controllers = require("../infrastructure/injectors");
const { authMiddleware } = require("../infrastructure/middlewares/auth");

router.post(
  "/mercadopago/crear-preferencia",
  [authMiddleware], // Protegemos la ruta para que solo paguen usuarios logueados
  (req, res, next) => controllers.mercadoPagoController.crear(req, res, next),
);
router.post("/mercadopago/confirmar-pago", [authMiddleware], (req, res, next) =>
  controllers.mercadoPagoController.confirmar(req, res, next),
);
router.post("/mercadopago/cancelar-pago", [authMiddleware], (req, res, next) =>
  controllers.mercadoPagoController.cancelar(req, res, next),
);
router.post("/mercadopago/webhook", (req, res, next) =>
  controllers.mercadoPagoController.webhook(req, res, next),
);

module.exports = {
  basePath: "/",
  router,
};
