class ProcesarWebhook {
  constructor({ ordenesRepository }) {
    this.$ordenes = ordenesRepository;
  }

  async execute(req) {
    // 1. Agarramos el ID de la orden que nos mandó MP en la URL
    const { orden_id } = req.query;

    if (orden_id) {
      // 2. Buscamos la orden en tu base de datos
      const orden = await this.$ordenes.findOne({ where: { id_orden: orden_id } });

      // 3. Si existe y estaba pendiente, ¡la pasamos a pagado!
      if (orden && orden.estado_pago === 'pendiente') {
        await orden.update({ estado_pago: 'pagado' });
        console.log(`✅ ¡BINGO! MERCADO PAGO AVISÓ Y LA ORDEN ${orden_id} ESTÁ PAGADA.`);
      }
    }
    return true;
  }
}

module.exports = ProcesarWebhook;