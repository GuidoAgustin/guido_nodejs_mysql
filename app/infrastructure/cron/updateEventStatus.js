// backend/app/infrastructure/cron/updateEventStatus.js
const cron = require("node-cron");
const { Op } = require("sequelize");
const { evento: EventoModel } = require("../../models"); // Importar el modelo Evento directamente

// Tarea para ejecutarse cada hora
cron.schedule('*/30 * * * * *', async () => {
  // console.log(`[CRON] ${new Date().toISOString()} - 
  // Ejecutando tarea para actualizar estado de eventos...`); // Log opcional

  try {
    const ahora = new Date();

    // Actualizar eventos a 'pasado'
    const [affectedPastRows] = await EventoModel.update(
      { estado_evento: "pasado" },
      {
        where: {
          fecha_hora_inicio: {
            // O fecha_hora_fin si prefieres
            [Op.lt]: ahora,
          },
          estado_evento: {
            [Op.in]: ["disponible", "proximamente", "agotado"], // Solo actualizar estos estados
          },
        },
      }
    );

    if (affectedPastRows > 0) {
      // console.log(`[CRON] Se actualizaron ${affectedPastRows} eventos a 'pasado'.`); // Log opcional
    }
  } catch (error) {
    console.error(
      "[CRON] Error al ejecutar la tarea de actualización de eventos:",
      error
    );
  }
});

// console.log(
//   "[CRON] Tarea de actualización de estado de eventos ha sido programada."
// );
