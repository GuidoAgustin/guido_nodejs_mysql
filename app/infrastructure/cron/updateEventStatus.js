const cron = require("node-cron");
const { Op } = require("sequelize");
const { evento: EventoModel } = require("../../models");

// Corre cada 30 segundos
cron.schedule('*/30 * * * * *', async () => {
  try {
    const ahora = new Date();

    // 🚀 TAREA 1: Lanzamientos Automáticos (Próximamente -> Disponible)
    const [affectedLaunchRows] = await EventoModel.update(
      { estado_evento: "disponible" },
      {
        where: {
          estado_evento: "proximamente",
          [Op.or]: [
            // Caso A: Tiene fecha programada de venta y ya llegó la hora
            {
              fecha_inicio_venta: { [Op.ne]: null, [Op.lte]: ahora }
            },
            // Caso B: NO tiene fecha programada, pero ya llegó la hora de inicio del evento
            {
              fecha_inicio_venta: null,
              fecha_hora_inicio: { [Op.lte]: ahora }
            }
          ]
        }
      }
    );

    // 🧟‍♂️ TAREA 2: "El Revividor" (Pasado -> Disponible)
    // Corrige eventos que quedaron en "pasado" pero tienen la venta en curso activa y aún no terminan
    const [affectedRevivedRows] = await EventoModel.update(
      { estado_evento: "disponible" },
      {
        where: {
          estado_evento: "pasado",
          vender_durante_evento: true,
          fecha_hora_inicio: { [Op.lte]: ahora }, // Ya empezó
          fecha_hora_fin: { [Op.ne]: null, [Op.gt]: ahora } // Pero NO terminó
        }
      }
    );

    // 🏁 TAREA 3: Cierre de Eventos (Disponibles o Próximamente -> Pasado)
    const [affectedPastRows] = await EventoModel.update(
      { estado_evento: "pasado" },
      {
        where: {
          estado_evento: { [Op.in]: ["disponible", "proximamente"] },
          [Op.or]: [
            // Caso A: No permite venta en curso, y ya arrancó
            { vender_durante_evento: false, fecha_hora_inicio: { [Op.lte]: ahora } },
            // Caso B: Permite venta en curso, pero ya pasó la fecha de FIN
            { vender_durante_evento: true, fecha_hora_fin: { [Op.ne]: null, [Op.lte]: ahora } },
            // Caso C: Permite venta en curso, PERO no le pusieron fecha de fin (corta al inicio para no quedar bugueado)
            { vender_durante_evento: true, fecha_hora_fin: null, fecha_hora_inicio: { [Op.lte]: ahora } }
          ]
        },
      }
    );

    // Logs para que veas la magia en tu terminal de backend
    if (affectedLaunchRows > 0) console.log(`[CRON] 🚀 Lanzamientos: ${affectedLaunchRows} eventos pasaron a 'disponible'.`);
    if (affectedRevivedRows > 0) console.log(`[CRON] 🧟‍♂️ Revividos: ${affectedRevivedRows} eventos volvieron a 'disponible' por venta en curso.`);
    if (affectedPastRows > 0) console.log(`[CRON] 🏁 Cierres: ${affectedPastRows} eventos pasaron a 'pasado'.`);

  } catch (error) {
    console.error("[CRON] Error al ejecutar la actualización de eventos:", error);
  }
});