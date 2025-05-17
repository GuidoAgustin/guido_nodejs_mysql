const express = require("express");

const router = express.Router();

const controllers = require("../infrastructure/injectors");
const { authMiddleware } = require("../infrastructure/middlewares/auth");

// Rutas de eventos
router.get("/", [], (req, res, next) =>
  controllers.eventosController.list(req, res, next)
);
router.post("/", [authMiddleware], (req, res, next) =>
  controllers.eventosController.create(req, res, next)
);
router.get("/:evento_id/tipos", [], (req, res, next) =>
  controllers.tiposEntradasController.list(req, res, next)
);

router.put("/:evento_id", [authMiddleware], (req, res, next) =>
  controllers.eventosController.update(req, res, next)
);
router.delete("/:evento_id", [authMiddleware], (req, res, next) =>
  controllers.eventosController.delete(req, res, next)
);

module.exports = {
  basePath: "/eventos",
  router,
};
