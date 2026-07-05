const express = require("express");

const router = express.Router();
const controllers = require("../infrastructure/injectors");
const {
  authMiddleware,
  adminMiddleware,
} = require("../infrastructure/middlewares/auth");

// --- Rutas Públicas ---
router.post("/login", [], (req, res, next) =>
  controllers.usersController.login(req, res, next),
);

router.post("/registro", [], (req, res, next) =>
  controllers.usersController.registro(req, res, next),
);

// 👇 NUEVA RUTA: No requiere token (porque justamente no puede entrar)
router.post("/forgot_password", [], (req, res, next) =>
  controllers.usersController.forgotPassword(req, res, next),
);

router.post(
  '/reset_password/:token',
  [],
  (req, res, next) => controllers.usersController.resetPassword(req, res, next)
);

// --- Rutas Privadas (Requieren Token) ---

// 1. Editar mi propio perfil
router.put("/profile", [authMiddleware], (req, res, next) =>
  controllers.usersController.updateProfile(req, res, next),
);

// 2. Listar todos los usuarios
router.get("/users", [authMiddleware], (req, res, next) =>
  controllers.usersController.getAllUsers(req, res, next),
);

// 👇 RUTAS DE ADMIN PROTEGIDAS 👇

// 3. Admin: Editar un usuario específico por ID
router.put("/users/:id", [authMiddleware, adminMiddleware], (req, res, next) =>
  controllers.usersController.adminUpdate(req, res, next),
);

// 4. Admin: Eliminar un usuario específico por ID
router.delete(
  "/users/:id",
  [authMiddleware, adminMiddleware],
  (req, res, next) => controllers.usersController.adminDelete(req, res, next),
);

module.exports = {
  basePath: "/",
  router,
};
