const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../infrastructure/middlewares/auth');



router.get(
  '/', [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.entradasVendidasesController.index(req, res, next),
);
    
router.post(
  '/', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.entradasVendidasesController.create(req, res, next),
);
    
router.get(
  '/:entradas_vendidas_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.entradasVendidasesController.show(req, res, next),
);
    
router.put(
  '/:entradas_vendidas_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.entradasVendidasesController.update(req, res, next),
);
    
router.delete(
  '/:entradas_vendidas_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.entradasVendidasesController.delete(req, res, next),
);
    
module.exports = {
  basePath: '/entradas_vendidases',
  router,
};
