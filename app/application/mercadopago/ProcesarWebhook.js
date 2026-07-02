// backend/app/application/mercadopago/ProcesarWebhook.js

class ProcesarWebhook {
  constructor({ ordenesRepository, entradasVendidasRepository, tiposEntradasRepository, sequelize }) {
    this.$ordenes = ordenesRepository;
    this.$entradas = entradasVendidasRepository; 
    this.$tipos = tiposEntradasRepository;
    this.sequelize = sequelize; // 🔥 Nuestro patovica anti-duplicados
  }

  async execute(req) {
    // MP manda info por query o por body dependiendo de si es Webhook o IPN, atajamos ambas.
    const orden_id = req.query.orden_id || req.body.data?.id;
    const estado_mp = req.query.estado || req.body.action || 'aprobado'; 

    if (!orden_id) return true; // Si MP manda un ping de prueba, lo dejamos pasar.

    // 🛡️ INICIAMOS LA TRANSACCIÓN
    const t = await this.sequelize.transaction();

    try {
      // 1. MODO PATOVICA: Buscamos la orden y la BLOQUEAMOS para otros webhooks simultáneos
      // 🔥 IMPORTANTE: Tendrás que crear este método en ordenes.repository.js
      const orden = await this.$ordenes.findByIdWithItems(orden_id, { 
        transaction: t, 
        lock: t.LOCK.UPDATE // Ningún otro proceso puede tocar esta fila hasta que terminemos
      });

      // Si no existe o ya no está pendiente, nos vamos silenciosamente (Idempotencia)
      if (!orden || orden.estado_pago !== 'pendiente') {
        await t.rollback();
        return true; 
      }

      // 2. CASO FELIZ: PAGADO
      if (estado_mp === 'aprobado' || estado_mp === 'payment.created') {
        await this.$ordenes.update(
          { ordenes_id: orden_id, datosAActualizar: { estado_pago: 'pagado' } }, 
          t
        );
      } 
      // 3. CASO TRISTE: RECHAZADO / CANCELADO
      else if (estado_mp === 'rechazado' || estado_mp === 'cancelado') {
        
        // Cancelamos la orden
        await this.$ordenes.update(
          { ordenes_id: orden_id, datosAActualizar: { estado_pago: 'cancelado' } }, 
          t
        );
        
        // Cancelamos las entradas
        // 🔥 IMPORTANTE: Crear método updateByOrdenId en entradasVendidasRepository
        await this.$entradas.updateByOrdenId(
          { id_orden: orden_id, datosAActualizar: { estado_entrada: 'cancelada' } }, 
          t
        );

        // 🌊 OPTIMIZACIÓN TSUNAMI: Agrupamos el stock a devolver
        const stockADevolver = {};
        for (const item of orden.itemsDeOrden) {
          if (!stockADevolver[item.id_tipo_entrada]) {
            stockADevolver[item.id_tipo_entrada] = 0;
          }
          stockADevolver[item.id_tipo_entrada] += 1;
        }

        // Devolvemos el stock agrupado (¡Un solo viaje por tipo de entrada!)
        for (const [id_tipo, cantidad] of Object.entries(stockADevolver)) {
          await this.$tipos.incrementStock(id_tipo, cantidad, t);
        }
        
        console.log(`❌ Orden ${orden_id} cancelada. Stock devuelto correctamente sin duplicados.`);
      }

      // Guardamos todos los cambios en la BD de forma segura
      await t.commit();

    } catch (error) {
      await t.rollback();
      console.error(`💥 Error crítico procesando webhook de orden ${orden_id}:`, error);
      // No le tiramos error a MP porque sino va a reintentar mandarlo 100 veces
    }

    return true; // Siempre decirle a MP "Recibido, gracias"
  }
}

module.exports = ProcesarWebhook;