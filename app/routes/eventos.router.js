const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../infrastructure/middlewares/auth');



router.get(
  '/', [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.eventosController.index(req, res, next),
);
    
router.post(
  '/', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.eventosController.create(req, res, next),
);
    
router.get(
  '/:evento_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.eventosController.show(req, res, next),
);
    
router.put(
  '/:evento_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.eventosController.update(req, res, next),
);
    
router.delete(
  '/:evento_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.eventosController.delete(req, res, next),
);
    
module.exports = {
  basePath: '/eventos',
  router,
};
