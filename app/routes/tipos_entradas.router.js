const express = require('express');

const router = express.Router();

const authMiddleware = require('../infrastructure/middlewares/auth');



router.get(
  '/', [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.tiposEntradasController.index(req, res, next),
);
    
router.post(
  '/', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.tiposEntradasController.create(req, res, next),
);
    
router.get(
  '/:tipos_entrada_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.tiposEntradasController.show(req, res, next),
);
    
router.put(
  '/:tipos_entrada_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.tiposEntradasController.update(req, res, next),
);
    
router.delete(
  '/:tipos_entrada_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.tiposEntradasController.delete(req, res, next),
);
    
module.exports = {
  basePath: '/tipos_entradas',
  router,
};
