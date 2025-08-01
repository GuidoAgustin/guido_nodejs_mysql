const express = require('express');

const router = express.Router();
const controllers = require('../infrastructure/injectors');
const { authMiddleware } = require('../infrastructure/middlewares/auth.js');

router.post(
  '/login',
  [],
  (req, res, next) => controllers.usersController.login(req, res, next),
);

router.put(
  '/profile',
  [authMiddleware],
  (req, res, next) => controllers.usersController.updateProfile(req, res, next),
);

router.post(
  '/registro',
  [],
  (req, res, next) => controllers.usersController.registro(req, res, next),
);

router.get(
  '/users',
  [authMiddleware], 
  (req, res, next) => controllers.usersController.getAllUsers(req, res, next),
);

module.exports = {
  basePath: '/',
  router,
};
