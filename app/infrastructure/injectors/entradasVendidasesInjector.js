const { EntradasVendidasesRepository } = require('../repositories');
const {
  GetEntradasVendidasesList,
  ShowEntradasVendidas,
  CreateEntradasVendidas,
  UpdateEntradasVendidas,
  DeleteEntradasVendidas,
} = require('../../application/Ticketing/entradas_vendidases');
const EntradasVendidasesController = require('../controllers/ticketing/EntradasVendidasesController');

module.exports = function registerController({ models }) {
  const entradasVendidasesRepository = new EntradasVendidasesRepository(models);

  const getEntradasVendidasesList = new GetEntradasVendidasesList(entradasVendidasesRepository);
  const createEntradasVendidas = new CreateEntradasVendidas(entradasVendidasesRepository);
  const showEntradasVendidas = new ShowEntradasVendidas(entradasVendidasesRepository);
  const updateEntradasVendidas = new UpdateEntradasVendidas(entradasVendidasesRepository);
  const deleteEntradasVendidas = new DeleteEntradasVendidas(entradasVendidasesRepository);

  return new EntradasVendidasesController({
    getEntradasVendidasesList,
    createEntradasVendidas,
    showEntradasVendidas,
    updateEntradasVendidas,
    deleteEntradasVendidas,
  });
};
