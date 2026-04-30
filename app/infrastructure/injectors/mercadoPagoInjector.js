const CrearPreferencia = require('../../application/mercadopago/CrearPreferencia');
const ConfirmarPagoManual = require('../../application/mercadopago/ConfirmarPagoManual');
const ProcesarWebhook = require('../../application/mercadopago/ProcesarWebhook'); // Importado OK

const MercadoPagoController = require('../controllers/mercadopago/MercadoPagoController'); 

module.exports = ({ models }) => {
  // 1. Instanciamos TODOS los casos de uso primero
  const crearPreferencia = new CrearPreferencia({ ordenesRepository: models.orden });
  const confirmarPagoManual = new ConfirmarPagoManual({ ordenesRepository: models.orden });
  const procesarWebhook = new ProcesarWebhook({ ordenesRepository: models.orden }); // <-- Lo creamos antes

  // 2. Le pasamos LOS TRES al controlador (¡acá te faltaba meter procesarWebhook!)
  const mercadoPagoController = new MercadoPagoController({ 
    crearPreferencia, 
    confirmarPagoManual,
    procesarWebhook 
  });

  return mercadoPagoController;
};