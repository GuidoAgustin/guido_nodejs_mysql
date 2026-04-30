const { MercadoPagoConfig, Preference } = require('mercadopago');

class CrearPreferencia {
  constructor({ ordenesRepository }) {
    this.$ordenes = ordenesRepository;
  }

  async execute({ orden_id, titulo_display, user_id }) {
    if (!orden_id) throw new Error("Falta el ID de la orden.");

    // 1. Buscamos la orden
    const orden = await this.$ordenes.findOne({
      where: { id_orden: orden_id, id_usuario: user_id, estado_pago: 'pendiente' }
    });

    if (!orden) throw new Error("La orden no existe o ya fue pagada.");

    // 2. Configuramos MP
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    // 3. Armamos el body con CUIDADO EXTREMO en las llaves y corchetes
    const body = {
      items: [
        {
          id: orden.id_orden.toString(),
          title: titulo_display || `Orden #${orden.id_orden}`,
          quantity: 1,
          unit_price: Number(orden.monto_total),
          currency_id: 'ARS'
        }
      ],
      external_reference: orden.id_orden.toString(),
      notification_url: `https://stage-cortex-domestic.ngrok-free.dev/mercadopago/webhook?orden_id=${orden.id_orden}`,
      // Asegurate de que esto sea back_urls (en plural) y no back_url
      back_urls: {
        success: `http://localhost:9091/carrito?pago=exito&orden_id=${orden.id_orden}`,
        failure: `http://localhost:9091/carrito?pago=error`,
        pending: `http://localhost:9091/carrito?pago=pendiente`
      },
      expires: true,
expiration_date_to: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      //auto_return: "approved"
    };

    try {
      // 4. Enviamos el pedido a MP
      const result = await preference.create({ body });
      
      // Devolvemos los dos links con sus nombres originales para que Vue no se maree
      return { 
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point 
      };
    } catch (error) {
      console.error("💥 Error en Mercado Pago:", error);
      throw new Error("No se pudo conectar con Mercado Pago");
    }
  }
}

module.exports = CrearPreferencia;