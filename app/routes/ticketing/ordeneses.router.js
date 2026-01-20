const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../../infrastructure/middlewares/auth");
const controllers = require("../../infrastructure/injectors");

router.get("/", [authMiddleware], (req, res, next) =>
  controllers.ordenesesController.index(req, res, next)
);

router.post("/", [authMiddleware], (req, res, next) =>
  controllers.ordenesesController.create(req, res, next)
);

router.get("/:ordenes_id", [authMiddleware], (req, res, next) =>
  controllers.ordenesesController.show(req, res, next)
);

router.put("/:ordenes_id", [authMiddleware], (req, res, next) =>
  controllers.ordenesesController.update(req, res, next)
);

router.delete("/:ordenes_id", [authMiddleware], (req, res, next) =>
  controllers.ordenesesController.delete(req, res, next)
);

module.exports = {
  basePath: "/ordenes",
  router,
};
