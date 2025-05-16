const express = require('express');

const router = express.Router();

const {authMiddleware} = require('../infrastructure/middlewares/auth');



router.get(
  '/', [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.ordenesesController.index(req, res, next),
);
    
router.post(
  '/', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.ordenesesController.create(req, res, next),
);
    
router.get(
  '/:ordenes_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.ordenesesController.show(req, res, next),
);
    
router.put(
  '/:ordenes_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.ordenesesController.update(req, res, next),
);
    
router.delete(
  '/:ordenes_id', 
  [
    authMiddleware,
  ],
  (req, res, next) => req.controllers.ordenesesController.delete(req, res, next),
);
    
module.exports = {
  basePath: '/ordeneses',
  router,
};
