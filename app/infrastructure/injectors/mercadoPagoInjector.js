// backend/app/infrastructure/injectors/mercadoPagoInjector.js

// 1. Importamos los Casos de Uso (Lógica de Negocio)
const CrearPreferencia = require('../../application/mercadopago/CrearPreferencia');
const ConfirmarPagoManual = require('../../application/mercadopago/ConfirmarPagoManual');
const ProcesarWebhook = require('../../application/mercadopago/ProcesarWebhook'); 
const CancelarPagoManual = require('../../application/mercadopago/CancelarPagoManual'); 

// 2. Importamos los Repositorios REALES (Acá estaba el bug)
const TiposEntradasRepository = require('../repositories/tipos_entradas.repository');
const OrdenesesRepository = require('../repositories/ordeneses.repository');
const EntradasVendidasesRepository = require('../repositories/entradas_vendidases.repository');
const MercadoPagoController = require('../controllers/mercadopago/MercadoPagoController'); 

module.exports = ({ models }) => {
  // 💡 Instanciamos los repositorios pasándoles los models
  const tiposEntradasRepository = new TiposEntradasRepository(models);
  const ordenesRepository = new OrdenesesRepository(models); // 🛠️ Fix
  const entradasVendidasRepository = new EntradasVendidasesRepository(models); // 🛠️ Fix

  // 3. Casos de Uso: Les damos sus herramientas (los repositorios instanciados)
  const crearPreferencia = new CrearPreferencia({ 
    ordenesRepository: ordenesRepository 
  });
  
  const confirmarPagoManual = new ConfirmarPagoManual({ 
    ordenesRepository: ordenesRepository 
  });

  const procesarWebhook = new ProcesarWebhook({ 
    ordenesRepository: ordenesRepository,
    entradasVendidasRepository: entradasVendidasRepository,
    tiposEntradasRepository: tiposEntradasRepository, 
    sequelize: models.sequelize // 🔥 EL PATOVICA: Le inyectamos la conexión para las transacciones
  }); 

  const cancelarPagoManual = new CancelarPagoManual({
    ordenesRepository: ordenesRepository,
    entradasVendidasRepository: entradasVendidasRepository,
    tiposEntradasRepository: tiposEntradasRepository 
  });

  // 4. Inyectamos todo en el Controlador
  const mercadoPagoController = new MercadoPagoController({ 
    crearPreferencia, 
    confirmarPagoManual,
    procesarWebhook,
    cancelarPagoManual 
  });

  return mercadoPagoController;
};