// backend/app/infrastructure/injectors/ordenesesInjector.js
const { 
  OrdenesesRepository, 
  TiposEntradasRepository, 
  EntradasVendidasesRepository // <<<< AÑADIR IMPORTACIÓN
} = require('../repositories'); 
const {
  GetOrdenesesList,
  ShowOrdenes,
  CreateOrdenes,
  UpdateOrdenes,
  DeleteOrdenes,
} = require('../../application/ordeneses');
const OrdenesesController = require('../controllers/OrdenesesController');

module.exports = function registerController({ models, sequelize }) {
  const ordenesesRepository = new OrdenesesRepository(models);
  const tiposEntradasRepository = new TiposEntradasRepository(models);
  const entradasVendidasesRepository = new EntradasVendidasesRepository(models); // <<<< INSTANCIAR

  const getOrdenesesList = new GetOrdenesesList(ordenesesRepository);
  const createOrdenes = new CreateOrdenes(
    ordenesesRepository, 
    entradasVendidasesRepository, // <<<< PASAR AL CONSTRUCTOR
    tiposEntradasRepository, 
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