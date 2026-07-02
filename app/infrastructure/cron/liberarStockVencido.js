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
    const tiempoLimite = new Date(Date.now() - 15 * 60 * 1000); 

    // 1. SOLO TRAEMOS LOS IDs (Ahorro masivo de memoria RAM)
    const ordenesVencidas = await OrdenModel.findAll({
      attributes: ['id_orden'],
      where: {
        estado_pago: 'pendiente',
        fecha_orden: { [Op.lt]: tiempoLimite }
      },
      raw: true
    });

    if (ordenesVencidas.length === 0) {
      return; // Nada para limpiar, nos vamos en silencio 🚔
    }

    // Armamos un array simple con los IDs: [15, 22, 104...]
    const idsVencidos = ordenesVencidas.map(o => o.id_orden);
    console.log(`[BARRENDERO] ¡Alerta! Encontré ${idsVencidos.length} órdenes abandonadas. Aspiradora industrial activada...`);

    // 🔥 UNA SOLA TRANSACCIÓN PARA TODO
    const t = await sequelize.transaction();

    try {
      // 2. AGRUPAMOS TODO EN SQL (La base de datos cuenta por nosotros)
      // Esto nos dice: "Hay que devolver 15 del tipo 1 y 8 del tipo 2"
      const ticketsADevolver = await EntradasVendidasModel.findAll({
        attributes: [
          'id_tipo_entrada', 
          [sequelize.fn('COUNT', sequelize.col('id_entrada_vendida')), 'cantidad']
        ],
        where: { id_orden: { [Op.in]: idsVencidos } },
        group: ['id_tipo_entrada'],
        raw: true,
        transaction: t
      });

      // 🔥 EL FIX ANTI-DEADLOCK (Ordenamos los IDs antes de bloquear)
      ticketsADevolver.sort((a, b) => a.id_tipo_entrada - b.id_tipo_entrada);

      // 3. DEVOLUCIÓN DE STOCK (Viajes mínimos a la base de datos)
      for (const ticket of ticketsADevolver) {
        const tipoEntrada = await TiposEntradaModel.findByPk(ticket.id_tipo_entrada, { 
          transaction: t, 
          lock: t.LOCK.UPDATE 
        });
        
        if (tipoEntrada) {
          tipoEntrada.cantidad_disponible += parseInt(ticket.cantidad);
          await tipoEntrada.save({ transaction: t });
        }
      }

      // 4. CANCELACIÓN MASIVA (De un solo plumazo)
      await OrdenModel.update(
        { estado_pago: 'cancelado' }, 
        { where: { id_orden: { [Op.in]: idsVencidos } }, transaction: t }
      );

      await EntradasVendidasModel.update(
        { estado_entrada: 'cancelada' },
        { where: { id_orden: { [Op.in]: idsVencidos } }, transaction: t }
      );

      await t.commit();
      console.log(`[BARRENDERO] ✅ Limpieza masiva completada. Stock devuelto con éxito.`);
        
    } catch (error) {
      await t.rollback();
      console.error(`[BARRENDERO] ❌ Falló la transacción de limpieza masiva:`, error.message);
    }

  } catch (error) {
    console.error("[BARRENDERO] 🚨 ¡El camión chocó al iniciar! Error crítico:", error);
  }
});