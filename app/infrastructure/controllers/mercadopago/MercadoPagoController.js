// backend/app/infrastructure/controllers/mercadopago/MercadoPagoController.js
const { getResponseCustom } = require('../../libs/serviceUtil');

class MercadoPagoController {
  // 👇 1. Recibimos a nuestro nuevo integrante del equipo acá
  constructor({ crearPreferencia, confirmarPagoManual, procesarWebhook, cancelarPagoManual }) {
    this.name = 'mercadoPagoController';
    this.crearPreferencia = crearPreferencia;
    this.confirmarPagoManual = confirmarPagoManual;
    this.procesarWebhook = procesarWebhook;
    this.cancelarPagoManual = cancelarPagoManual; // <-- Lo guardamos en la clase
  }

  async crear(req, res, next) {
    try {
      const user_id = req.user.user_id || req.user.id;
      const { orden_id, titulo_display } = req.body;
      
      const result = await this.crearPreferencia.execute({ 
        orden_id, 
        titulo_display, 
        user_id 
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async confirmar(req, res, next) {
    try {
      const user_id = req.user.user_id || req.user.id;
      const { orden_id } = req.body;
      
      const result = await this.confirmarPagoManual.execute({ orden_id, user_id });
      
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  // 👇 2. ¡Creamos la ventanilla para cancelar!
  async cancelar(req, res, next) {
    try {
      const user_id = req.user.user_id || req.user.id;
      const { orden_id } = req.body;
      
      // Llamamos al caso de uso que hace la magia de bajar la orden y los tickets
      const result = await this.cancelarPagoManual.execute({ orden_id, user_id });
      
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async webhook(req, res, next) {
    try {
      await this.procesarWebhook.execute(req);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error en el Webhook:", error);
      res.status(500).send("Error");
    }
  }
}

module.exports = MercadoPagoController;