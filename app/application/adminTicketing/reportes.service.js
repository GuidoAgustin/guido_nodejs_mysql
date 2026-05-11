const { Op } = require('sequelize');
const db = require('../../models'); 

class ReportesService {
  static async obtenerMetricas(start, end, id_evento = null) {
    
    // 👇 1. LIMPIEZA EXTREMA
    const cleanStart = (start && start !== 'null' && start !== 'undefined' && start !== "") ? start : null;
    const cleanEnd = (end && end !== 'null' && end !== 'undefined' && end !== "") ? end : null;
    const filterEventoId = (id_evento && id_evento !== 'null' && id_evento !== "") ? id_evento : null;

    // 👇 2. FILTRO DE FECHAS REAL
    const orderDateFilter = {};
    if (cleanStart && cleanEnd) {
      orderDateFilter.fecha_orden = {
        [Op.between]: [new Date(`${cleanStart}T00:00:00Z`), new Date(`${cleanEnd}T23:59:59Z`)]
      };
    }

    // ---------------------------------------------------------
    // 3. 💸 INGRESOS Y 🎫 VENTAS
    // ---------------------------------------------------------
    const includeFilters = [{
      model: db.orden,
      as: 'ordenInfo',
      where: { ...orderDateFilter, estado_pago: 'pagado' },
      attributes: []
    }];

    if (filterEventoId) {
      includeFilters.push({
        model: db.tipos_entrada,
        as: 'tipoEntrada',
        where: { id_evento: filterEventoId },
        attributes: []
      });
    }

    const monthlyRevenue = await db.entradas_vendidas.sum('precio_pagado', {
      where: { estado_entrada: { [Op.in]: ['valida', 'utilizada'] } },
      include: includeFilters
    }) || 0;

    const totalTicketsSold = await db.entradas_vendidas.count({
      where: { estado_entrada: { [Op.in]: ['valida', 'utilizada'] } },
      include: includeFilters
    }) || 0;

    // ---------------------------------------------------------
    // 4. 🏟️ CAPACIDAD TOTAL
    // ---------------------------------------------------------
    const capacityWhere = {};
    if (filterEventoId) capacityWhere.id_evento = filterEventoId;
    
    const totalCapacity = await db.tipos_entrada.sum('cantidad_total', {
      where: capacityWhere
    }) || 0;

    // ---------------------------------------------------------
    // 5. ❌ CANCELACIONES
    // ---------------------------------------------------------
    const cancellationInclude = [{
      model: db.orden,
      as: 'ordenInfo',
      where: orderDateFilter,
      attributes: []
    }];

    if (filterEventoId) {
      cancellationInclude.push({
        model: db.tipos_entrada,
        as: 'tipoEntrada',
        where: { id_evento: filterEventoId },
        attributes: []
      });
    }

    const cancellations = await db.entradas_vendidas.count({
      where: { estado_entrada: 'cancelada' },
      include: cancellationInclude
    }) || 0;

    // ---------------------------------------------------------
    // 6. 🧮 CÁLCULOS FINALES
    // ---------------------------------------------------------
    const averageSale = totalTicketsSold > 0 ? Math.round(monthlyRevenue / totalTicketsSold) : 0;
    
    let averageOccupancy = 0;
    if (totalCapacity > 0) {
      averageOccupancy = Math.round((totalTicketsSold / totalCapacity) * 100);
    }
    if (averageOccupancy > 100) averageOccupancy = 100;

    // ---------------------------------------------------------
    // 7. 🏆 EL MEJOR EVENTO
    // ---------------------------------------------------------
    let topEventName = "Sin datos";
    let topEventRevenue = 0;

    const queryRanking = `
      SELECT e.nombre_evento, SUM(ev.precio_pagado) as total_recaudado
      FROM entradas_vendidas ev
      INNER JOIN orden o ON ev.id_orden = o.id_orden
      INNER JOIN tipos_entrada te ON ev.id_tipo_entrada = te.id_tipo_entrada
      INNER JOIN evento e ON te.id_evento = e.evento_id
      WHERE ev.estado_entrada IN ('valida', 'utilizada')
      AND o.estado_pago = 'pagado'
      ${(cleanStart && cleanEnd) ? `AND o.fecha_orden BETWEEN '${cleanStart} 00:00:00' AND '${cleanEnd} 23:59:59'` : ''}
      GROUP BY e.evento_id, e.nombre_evento
      ORDER BY total_recaudado DESC
      LIMIT 1;
    `;

    try {
      const [resultados] = await db.sequelize.query(queryRanking);
      if (resultados && resultados.length > 0) {
        topEventName = resultados[0].nombre_evento;
        topEventRevenue = resultados[0].total_recaudado;
      }
    } catch (e) { console.error("Error ranking:", e); }

    // ---------------------------------------------------------
    // 8. 📊 DESGLOSE DE GRÁFICOS (¡AHORA SÍ MIRA LAS FECHAS!)
    // ---------------------------------------------------------
    const breakdownWhere = {};
    if (filterEventoId) breakdownWhere.id_evento = filterEventoId;

    // A. Traemos el molde de las entradas
    const ticketTypes = await db.tipos_entrada.findAll({
      where: breakdownWhere,
      attributes: ['id_tipo_entrada', 'id_evento', 'nombre_tipo', 'cantidad_total', 'precio']
    });

    // B. CONTAMOS cuántas se vendieron EXACTAMENTE en ese rango de fechas
    const ventasReales = await db.entradas_vendidas.findAll({
      where: { estado_entrada: { [Op.in]: ['valida', 'utilizada'] } },
      attributes: [
        'id_tipo_entrada',
        // 👇 ACÁ ESTABA EL ERROR: Cambiamos 'id_entrada' por 'id_entrada_vendida' 👇
        [db.sequelize.fn('COUNT', db.sequelize.col('id_entrada_vendida')), 'cantidad_vendida']
      ],
      include: [{
        model: db.orden,
        as: 'ordenInfo',
        where: orderDateFilter,
        attributes: []
      }],
      group: ['id_tipo_entrada']
    });

    // Armamos una libretita con lo que se vendió: { id_tipo_entrada: cantidad }
    const mapaVentas = {};
    ventasReales.forEach(v => {
      mapaVentas[v.id_tipo_entrada] = parseInt(v.getDataValue('cantidad_vendida')) || 0;
    });

    // C. Diccionario de Eventos
    const listaEventos = await db.evento.findAll({ attributes: ['evento_id', 'nombre_evento'] });
    const mapaEventos = {};
    listaEventos.forEach(e => { mapaEventos[e.evento_id] = e.nombre_evento; });

    // D. Unimos todo
    const ticketBreakdown = ticketTypes.map(t => {
      const soldInPeriod = mapaVentas[t.id_tipo_entrada] || 0;
      
      return {
        nombre_evento: mapaEventos[t.id_evento] || 'Evento Desconocido', 
        name: t.nombre_tipo,
        total: t.cantidad_total,
        sold: soldInPeriod, // Lo vendido en la fecha
        remaining: t.cantidad_total - soldInPeriod, // Lo que NO se vendió en esa fecha
        revenue: soldInPeriod * t.precio,
        percentage: t.cantidad_total > 0 ? Math.round((soldInPeriod / t.cantidad_total) * 100) : 0
      };
    });

    return {
      monthlyRevenue,
      averageSale,
      topEvent: topEventName,
      topEventRevenue,
      completedEvents: await db.evento.count({ where: { estado_evento: 'pasado', ...(filterEventoId && { evento_id: filterEventoId }) } }),
      averageOccupancy,
      cancellations,
      ticketBreakdown
    };
  }
}

module.exports = ReportesService;