// backend/app/infrastructure/injectors/mercadoPagoInjector.js

// 1. Importamos los Casos de Uso (Lógica de Negocio)
const CrearPreferencia = require('../../application/mercadopago/CrearPreferencia');
const ConfirmarPagoManual = require('../../application/mercadopago/ConfirmarPagoManual');
const ProcesarWebhook = require('../../application/mercadopago/ProcesarWebhook'); 
const CancelarPagoManual = require('../../application/mercadopago/CancelarPagoManual'); 

// 2. Importamos el Repositorio de Stock
const TiposEntradasRepository = require('../repositories/tipos_entradas.repository');
const MercadoPagoController = require('../controllers/mercadopago/MercadoPagoController'); 

module.exports = ({ models }) => {
  // 💡 Instanciamos el repositorio primero para pasárselo a los que lo necesitan
  const tiposEntradasRepository = new TiposEntradasRepository(models);

  // 3. Casos de Uso: Les damos sus herramientas (repos)
  const crearPreferencia = new CrearPreferencia({ 
    ordenesRepository: models.orden 
  });
  
  const confirmarPagoManual = new ConfirmarPagoManual({ 
    ordenesRepository: models.orden 
  });

  const procesarWebhook = new ProcesarWebhook({ 
    ordenesRepository: models.orden,
    entradasVendidasRepository: models.entradas_vendidas,
    tiposEntradasRepository // 👈 Para devolver stock en el webhook
  }); 

  const cancelarPagoManual = new CancelarPagoManual({
    ordenesRepository: models.orden,
    entradasVendidasRepository: models.entradas_vendidas,
    tiposEntradasRepository // 👈 Para devolver stock en la cancelación manual
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