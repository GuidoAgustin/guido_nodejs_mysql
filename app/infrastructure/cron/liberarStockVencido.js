// backend/app/infrastructure/cron/liberarStockVencido.js
const cron = require("node-cron");
const { Op } = require("sequelize");
const { 
  orden: OrdenModel, 
  entradas_vendidas: EntradasVendidasModel, 
  tipos_entrada: TiposEntradaModel, 
  sequelize 
} = require("../../models");

// 🧹 El camión barrendero pasa cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  try {
    // 💡 ESTRATEGIA: Calculamos el tiempo límite en JAVASCRIPT
    // Es más seguro porque controlamos exactamente qué hora es.
    const tiempoLimite = new Date(Date.now() - 15 * 60 * 1000); 

    console.log(`[BARRENDERO] Iniciando barrido... Buscando órdenes pendientes desde: ${tiempoLimite.toISOString()}`);

    const ordenesVencidas = await OrdenModel.findAll({
      where: {
        estado_pago: 'pendiente',
        fecha_orden: {
          [Op.lt]: tiempoLimite // Buscamos cualquier cosa creada ANTES de hace 15 min
        }
      },
      include: [{ model: EntradasVendidasModel, as: 'itemsDeOrden' }]
    });

    if (ordenesVencidas.length === 0) {
      console.log("[BARRENDERO] Nada para limpiar. ¡Seguimos patrullando! 🚔");
      return;
    }

    console.log(`[BARRENDERO] ¡Alerta! Encontré ${ordenesVencidas.length} órdenes abandonadas. Procediendo al rescate del stock...`);

    for (const orden of ordenesVencidas) {
      const t = await sequelize.transaction();

      try {
        // 🔄 DEVOLUCIÓN DE STOCK
        // Agrupamos por tipo para hacer menos queries a la base
        const conteoPorTipo = {};
        if (orden.itemsDeOrden) {
          for (const item of orden.itemsDeOrden) {
            conteoPorTipo[item.id_tipo_entrada] = (conteoPorTipo[item.id_tipo_entrada] || 0) + 1;
          }
        }

        for (const id_tipo in conteoPorTipo) {
          const tipoEntrada = await TiposEntradaModel.findByPk(id_tipo, { transaction: t, lock: t.LOCK.UPDATE });
          if (tipoEntrada) {
            tipoEntrada.cantidad_disponible += conteoPorTipo[id_tipo];
            await tipoEntrada.save({ transaction: t });
          }
        }

        // ❌ CANCELACIÓN TOTAL
        await orden.update({ estado_pago: 'cancelado' }, { transaction: t });

        await EntradasVendidasModel.update(
          { estado_entrada: 'cancelada' },
          { where: { id_orden: orden.id_orden }, transaction: t }
        );

        await t.commit();
        console.log(`[BARRENDERO] ✅ Orden #${orden.id_orden} liquidada y stock devuelto.`);
        
      } catch (error) {
        await t.rollback();
        console.error(`[BARRENDERO] ❌ Falló la limpieza de la Orden #${orden.id_orden}:`, error.message);
      }
    }

  } catch (error) {
    console.error("[BARRENDERO] 🚨 ¡El camión chocó! Error crítico:", error);
  }
});