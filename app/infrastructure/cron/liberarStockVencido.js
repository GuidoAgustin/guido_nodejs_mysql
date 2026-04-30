// backend/app/infrastructure/cron/liberarStockVencido.js
const cron = require("node-cron");
const { Op } = require("sequelize");
const { 
  orden: OrdenModel, 
  entradas_vendidas: EntradasVendidasModel, 
  tipos_entrada: TiposEntradaModel, 
  sequelize 
} = require("../../models");

// Esta tarea corre cada 5 minutos para pasar la escoba
cron.schedule('*/5 * * * *', async () => {
  try {
    // Calculamos la fecha límite (15 minutos hacia atrás desde AHORA)
    const limiteMinutos = 15;
    const tiempoLimite = new Date(Date.now() - limiteMinutos * 60 * 1000);

// 1. Buscamos todas las órdenes pendientes que sean más viejas que el límite
    const ordenesVencidas = await OrdenModel.findAll({
      where: {
        estado_pago: 'pendiente',
        // ¡Magia pura! Le decimos a MySQL que busque las de hace 15 minutos exactos según su propio reloj
        fecha_orden: {
          [Op.lt]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 15 MINUTE)')
        }
      },
      include: [{ model: EntradasVendidasModel, as: 'itemsDeOrden' }]
    });

    if (ordenesVencidas.length === 0) return; // Si no hay nadie expirado, seguimos durmiendo

    console.log(`[BARRENDERO] Se encontraron ${ordenesVencidas.length} órdenes expiradas. Liberando stock...`);

    // 2. Procesamos cada orden vencida una por una de forma segura
    for (const orden of ordenesVencidas) {
      const t = await sequelize.transaction();

      try {
        // A) Contar cuántas entradas de cada tipo hay que devolver
        const conteoPorTipo = {};
        for (const item of orden.itemsDeOrden) {
          conteoPorTipo[item.id_tipo_entrada] = (conteoPorTipo[item.id_tipo_entrada] || 0) + 1;
        }

        // B) Devolver el stock a la base de datos
        for (const id_tipo in conteoPorTipo) {
          const tipoEntrada = await TiposEntradaModel.findByPk(id_tipo, { 
            transaction: t, 
            lock: t.LOCK.UPDATE // Bloqueamos la fila para que no haya sobreventa cruzada
          });

          if (tipoEntrada) {
            tipoEntrada.cantidad_disponible += conteoPorTipo[id_tipo];
            await tipoEntrada.save({ transaction: t });
          }
        }

        // C) Marcar la orden como cancelada para que Mercado Pago ya no la tome
        orden.estado_pago = 'cancelado';
        await orden.save({ transaction: t });

        // D) Anular físicamente las entradas generadas
        await EntradasVendidasModel.update(
          { estado_entrada: 'cancelada' },
          { where: { id_orden: orden.id_orden }, transaction: t }
        );

        await t.commit(); // Confirmamos los cambios de esta orden
        console.log(`[BARRENDERO] Orden #${orden.id_orden} cancelada con éxito. Stock restaurado.`);
        
      } catch (error) {
        await t.rollback(); // Si explota esta orden, no rompemos el resto
        console.error(`[BARRENDERO] Error al restaurar la orden #${orden.id_orden}:`, error);
      }
    }

  } catch (error) {
    console.error("[BARRENDERO] Error crítico en el cron general:", error);
  }
});