const { EntradasVendidasesRepository } = require('../repositories');
const {
  GetEntradasVendidasesList,
  ShowEntradasVendidas,
  GetTicketByCodigo,
} = require('../../application/Ticketing/entradas_vendidases');
const EntradasVendidasesController = require('../controllers/ticketing/EntradasVendidasesController');

module.exports = function registerController({ models }) {
  const entradasVendidasesRepository = new EntradasVendidasesRepository(models);

  const getEntradasVendidasesList = new GetEntradasVendidasesList(entradasVendidasesRepository);
  const showEntradasVendidas = new ShowEntradasVendidas(entradasVendidasesRepository);
  const getTicketByCodigo = new GetTicketByCodigo(entradasVendidasesRepository);

  return new EntradasVendidasesController({
    getEntradasVendidasesList,
    showEntradasVendidas,
    getTicketByCodigo,
  });
};
