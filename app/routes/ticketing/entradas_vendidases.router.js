const express = require("express");

const router = express.Router();
const { authMiddleware } = require("../../infrastructure/middlewares/auth");
const controllers = require("../../infrastructure/injectors");

// 🔔 EL TIMBRE 1: Esto imprime apenas guardás el archivo, fuera de cualquier ruta.
// Si no ves esto en tu consola negra al guardar, Nodemon no está leyendo este archivo.
console.log("🔥 ¡El archivo entradas_vendidases.router.js se cargó correctamente en el servidor!");

// 🧪 EL TIMBRE 2: Una ruta de prueba a prueba de balas.
router.get("/ping", (req, res) => {
  res.json({ mensaje: "¡PONG! 🏓 El router está vivo y escuchando." });
});

// 🎟️ NUESTRA RUTA DEL TICKET
router.get("/ticket/:codigo_unico", (req, res, next) => {
  console.log("🎯 ¡BINGO! El Patovica nos dejó pasar a la ruta del PDF.");
  controllers.entradasVendidasesController.downloadTicket(req, res, next);
});

router.get("/", [authMiddleware], (req, res, next) =>
  controllers.entradasVendidasesController.index(req, res, next)
);

router.post("/", [authMiddleware], (req, res, next) =>
  controllers.entradasVendidasesController.create(req, res, next)
);

router.get("/:entradas_vendidas_id", [authMiddleware], (req, res, next) =>
  controllers.entradasVendidasesController.show(req, res, next)
);

router.put("/:entradas_vendidas_id", [authMiddleware], (req, res, next) =>
  controllers.entradasVendidasesController.update(req, res, next)
);  

router.delete("/:entradas_vendidas_id", [authMiddleware], (req, res, next) =>
  controllers.entradasVendidasesController.delete(req, res, next)
);

module.exports = {
  basePath: "/entradas_vendidases",
  router,
};
