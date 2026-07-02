// backend/app/infrastructure/injectors/carritoInjector.js
const GetMisCompras = require('../../application/carrito/GetMisCompras');
const CarritoController = require('../controllers/CarritoController');

// 🔥 IMPORTAMOS LOS REPOSITORIOS REALES
const OrdenesesRepository = require('../repositories/ordeneses.repository');
const EntradasVendidasesRepository = require('../repositories/entradas_vendidases.repository');

module.exports = ({ models }) => {
  // 💡 Instanciamos las cajas de herramientas reales pasándoles los modelos
  const ordenesRepository = new OrdenesesRepository(models);
  const entradasVendidasRepository = new EntradasVendidasesRepository(models);

  const getMisCompras = new GetMisCompras({
    ordenesRepository,            // 🛠️ Fix: Repositorio real instanciado
    entradasVendidasRepository,   // 🛠️ Fix: Repositorio real instanciado
    tiposEntradaRepository: models.tipos_entrada, // Dejamos estos si el caso de uso los usa de molde
    eventoRepository: models.evento
  });

  const carritoController = new CarritoController({
    getMisCompras
  });

  return carritoController;
};