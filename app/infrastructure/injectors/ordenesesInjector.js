// backend/app/infrastructure/injectors/ordenesesInjector.js
const { 
  OrdenesesRepository, 
  TiposEntradasRepository, 
  EntradasVendidasesRepository,
  EventosRepository // Añadir EventosRepository
} = require('../repositories'); 
const {
  GetOrdenesesList,
  ShowOrdenes,
  CreateOrdenes,
  UpdateOrdenes,
  DeleteOrdenes,
} = require('../../application/Ticketing/ordeneses');
const OrdenesesController = require('../controllers/ticketing/OrdenesesController');

module.exports = function registerController({ models, sequelize }) {
  const ordenesesRepository = new OrdenesesRepository(models);
  const tiposEntradasRepository = new TiposEntradasRepository(models);
  const entradasVendidasesRepository = new EntradasVendidasesRepository(models);
  const eventosRepository = new EventosRepository(models); // Instanciar EventosRepository

  const getOrdenesesList = new GetOrdenesesList(ordenesesRepository);
  const createOrdenes = new CreateOrdenes(
    ordenesesRepository, 
    entradasVendidasesRepository,
    tiposEntradasRepository, 
    eventosRepository, // Pasar EventosRepository
    sequelize
  ); 
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