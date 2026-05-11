// backend/app/application/mercadopago/ProcesarWebhook.js

class ProcesarWebhook {
  // 👇 Inyectamos a nuestro nuevo empleado: el repo de entradas
  constructor({ ordenesRepository, entradasVendidasRepository, tiposEntradasRepository }) {
    this.$ordenes = ordenesRepository;
    this.$entradas = entradasVendidasRepository; 
    this.$tipos = tiposEntradasRepository; // <-- Nuevo integrante
  }

 async execute(req) {
    const { orden_id } = req.query;
    const estado_mp = req.query.estado || 'aprobado'; 

    if (orden_id) {
      // Traemos la orden con sus entradas para saber QUÉ devolver
      const orden = await this.$ordenes.findOne({ 
        where: { id_orden: orden_id },
        include: [{ model: this.$entradas.models.entradas_vendidas, as: 'itemsDeOrden' }] 
      });

      if (orden && orden.estado_pago === 'pendiente') {
        if (estado_mp === 'aprobado') {
          await orden.update({ estado_pago: 'pagado' });
        } 
        else if (estado_mp === 'rechazado' || estado_mp === 'cancelado') {
          await orden.update({ estado_pago: 'cancelado' });
          
          await this.$entradas.update(
            { estado_entrada: 'cancelada' }, 
            { where: { id_orden: orden_id } }
          );

          // 🔄 ¡MAGIA! Devolvemos el stock por cada tipo de entrada en la orden
          for (const item of orden.itemsDeOrden) {
            await this.$tipos.incrementStock(item.id_tipo_entrada, 1);
          }
          
          console.log(`❌ Orden ${orden_id} cancelada. Stock devuelto.`);
        }
      }
    }
    return true;
  }
}

module.exports = ProcesarWebhook;