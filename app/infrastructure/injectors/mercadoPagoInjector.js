// backend/app/infrastructure/injectors/mercadoPagoInjector.js

// 1. Importamos los Casos de Uso (Lógica de Negocio)
const CrearPreferencia = require('../../application/mercadopago/CrearPreferencia');
const ConfirmarPagoManual = require('../../application/mercadopago/ConfirmarPagoManual');
const ProcesarWebhook = require('../../application/mercadopago/ProcesarWebhook'); 
const CancelarPagoManual = require('../../application/mercadopago/CancelarPagoManual'); 

// 👇 IMPORTAMOS LAS HERRAMIENTAS NUEVAS PARA EL MAIL Y EL QR
const { mail } = require('../libs/mailer'); // Extraemos 'mail' que es la instancia de Nodemailer
const { generateQRBase64 } = require('../libs/qrGenerator'); // La función que creamos recién

// 2. Importamos los Repositorios REALES
const TiposEntradasRepository = require('../repositories/tipos_entradas.repository');
const OrdenesesRepository = require('../repositories/ordeneses.repository');
const EntradasVendidasesRepository = require('../repositories/entradas_vendidases.repository');
const MercadoPagoController = require('../controllers/mercadopago/MercadoPagoController'); 

module.exports = ({ models }) => {
  // 💡 Instanciamos los repositorios pasándoles los models
  const tiposEntradasRepository = new TiposEntradasRepository(models);
  const ordenesRepository = new OrdenesesRepository(models); 
  const entradasVendidasRepository = new EntradasVendidasesRepository(models); 

  // 3. Casos de Uso: Les damos sus herramientas (los repositorios instanciados)
  const crearPreferencia = new CrearPreferencia({ 
    ordenesRepository: ordenesRepository 
  });
  
 const confirmarPagoManual = new ConfirmarPagoManual({ 
    ordenesRepository: ordenesRepository,
    entradasVendidasRepository: entradasVendidasRepository, // Para buscar las entradas del mail
    sequelize: models.sequelize, // Para las transacciones
    mailerService: mail, // El correo
    qrGenerator: { generateQRBase64 } // Los QRs
  });

  const procesarWebhook = new ProcesarWebhook({ 
    ordenesRepository: ordenesRepository,
    entradasVendidasRepository: entradasVendidasRepository,
    tiposEntradasRepository: tiposEntradasRepository, 
    sequelize: models.sequelize, // 🔥 EL PATOVICA: Le inyectamos la conexión para las transacciones
    mailerService: mail, // 💌 ¡Le damos la llave del correo!
    qrGenerator: { generateQRBase64 } // 🎟️ ¡Le damos la fábrica de QRs!
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