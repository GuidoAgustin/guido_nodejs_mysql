const express = require('express');

const router = express.Router();
const controllers = require('../infrastructure/injectors');
const { authMiddleware } = require('../infrastructure/middlewares/auth');

// --- Rutas Públicas ---
router.post(
  '/login',
  [],
  (req, res, next) => controllers.usersController.login(req, res, next),
);

router.post(
  '/registro',
  [],
  (req, res, next) => controllers.usersController.registro(req, res, next),
);

// --- Rutas Privadas (Requieren Token) ---

// 1. Editar mi propio perfil
router.put(
  '/profile',
  [authMiddleware],
  (req, res, next) => controllers.usersController.updateProfile(req, res, next),
);

// 2. Listar todos los usuarios
router.get(
  '/users',
  [authMiddleware], 
  (req, res, next) => controllers.usersController.getAllUsers(req, res, next),
);

// 👇 AGREGAR ESTAS DOS RUTAS NUEVAS 👇

// 3. Admin: Editar un usuario específico por ID
router.put(
  '/users/:id', // <--- El :id es clave, Express lo captura en req.params.id
  [authMiddleware], 
  (req, res, next) => controllers.usersController.adminUpdate(req, res, next),
);

// 4. Admin: Eliminar un usuario específico por ID
router.delete(
  '/users/:id', 
  [authMiddleware], 
  (req, res, next) => controllers.usersController.adminDelete(req, res, next),
);

module.exports = {
  basePath: '/',
  router,
};