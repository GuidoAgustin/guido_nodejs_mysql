// backend/app/infrastructure/controllers/adminTicketing/reportes.controller.js
const ReportesService = require('../../../application/adminTicketing/reportes.service');

class ReportesController {
  static async getReportesDashboard(req, res) {
    try {
      // 👇 1. Agregamos id_evento para atajarlo desde la URL
      const { start, end, id_evento } = req.query; 
      console.log(`[Admin Panel] Solicitando reportes al servicio. Evento: ${id_evento || 'Todos'}`);

      // 👇 2. Se lo pasamos al Chef
      const metricas = await ReportesService.obtenerMetricas(start, end, id_evento);

      res.status(200).json({
        success: true,
        data: metricas
      });
    } catch (error) {
      console.error("Error en ReportesController:", error);
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }
}

module.exports = ReportesController;