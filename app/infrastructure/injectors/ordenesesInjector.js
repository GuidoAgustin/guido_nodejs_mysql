const { OrdenesesRepository } = require('../repositories');
const {
  GetOrdenesesList,
  ShowOrdenes,
  CreateOrdenes,
  UpdateOrdenes,
  DeleteOrdenes,
} = require('../../application/ordeneses');
const OrdenesesController = require('../controllers/OrdenesesController');

module.exports = function registerController({ models }) {
  const ordenesesRepository = new OrdenesesRepository(models);

  const getOrdenesesList = new GetOrdenesesList(ordenesesRepository);
  const createOrdenes = new CreateOrdenes(ordenesesRepository);
  const showOrdenes = new ShowOrdenes(ordenesesRepository);
  const updateOrdenes = new UpdateOrdenes(ordenesesRepository);
  const deleteOrdenes = new DeleteOrdenes(ordenesesRepository);

  return new OrdenesesController({
    getOrdenesesList,
    createOrdenes,
    showOrdenes,
    updateOrdenes,
    deleteOrdenes,
  });
};
