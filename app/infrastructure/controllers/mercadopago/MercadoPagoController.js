const { getResponseCustom } = require('../../libs/serviceUtil');

class MercadoPagoController {
  constructor({ crearPreferencia, confirmarPagoManual, procesarWebhook }) {
    this.name = 'mercadoPagoController';
    this.crearPreferencia = crearPreferencia;
    this.confirmarPagoManual = confirmarPagoManual;
    this.procesarWebhook = procesarWebhook;

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

  async webhook(req, res, next) {
    try {
      // Le mandamos el aviso al caso de uso
      await this.procesarWebhook.execute(req);
      
      // A Mercado Pago SIEMPRE hay que contestarle con un 200 OK rápido
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error en el Webhook:", error);
      res.status(500).send("Error");
    }
  }
}

module.exports = MercadoPagoController;