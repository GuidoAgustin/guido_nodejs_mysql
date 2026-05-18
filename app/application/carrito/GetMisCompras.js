class GetMisCompras {
  constructor({ ordenesRepository, entradasVendidasRepository, tiposEntradaRepository, eventoRepository }) {
    this.$ordenes = ordenesRepository;
    this.$entradasVendidas = entradasVendidasRepository;
    this.$tiposEntrada = tiposEntradaRepository;
    this.$evento = eventoRepository;
    
    // El "molde" de Sequelize que se repite en las consultas
    this.queryInception = {
      model: this.$entradasVendidas,
      as: 'itemsDeOrden',
      include: [{
        model: this.$tiposEntrada,
        as: 'tipoEntrada',
        include: [{
          model: this.$evento,
          as: 'eventoInfo'
        }]
      }]
    };
  }

  // 🎟️ 1. SOLAMENTE ENTRADAS ACTIVAS Y PENDIENTES
  async executeEntradasActivas({ user_id }) {
    if (!user_id) throw new Error('El ID de usuario es requerido');
    
    const ordenesPendientes = await this.$ordenes.findAll({
      where: { id_usuario: user_id, estado_pago: 'pendiente' },
      include: [this.queryInception]
    });

    const ordenesPagadas = await this.$ordenes.findAll({
      where: { id_usuario: user_id, estado_pago: 'pagado' },
      include: [this.queryInception]
    });

    const entradasProximas = [];
    ordenesPagadas.forEach(orden => {
      if (orden.itemsDeOrden) {
        orden.itemsDeOrden.forEach(item => {
          // Solo lo que NO se usó ni se canceló
          if (item.estado_entrada !== 'utilizada' && item.estado_entrada !== 'cancelada') {
            entradasProximas.push(this._mapearItem(orden, item));
          }
        });
      }
    });

    return {
      entradasPendientes: this._formatearOrdenes(ordenesPendientes),
      entradasProximas: entradasProximas
    };
  }

  // 🛍️ 2. SOLAMENTE TIENDA / E-COMMERCE ACTIVO
  async executeTiendaActiva({ user_id }) {
    if (!user_id) throw new Error('El ID de usuario es requerido');
    // Dejado listo para cuando conectes las tablas de ropa/productos
    return {
      productosPendientes: [],
      productosActivos: []
    };
  }

  // 📜 3. SOLAMENTE HISTORIAL (TODO LO VIEJO O USADO)
  async executeHistorial({ user_id }) {
    if (!user_id) throw new Error('El ID de usuario es requerido');

    const ordenesPagadas = await this.$ordenes.findAll({
      where: { id_usuario: user_id, estado_pago: 'pagado' },
      include: [this.queryInception]
    });

    const entradasPasadas = [];
    ordenesPagadas.forEach(orden => {
      if (orden.itemsDeOrden) {
        orden.itemsDeOrden.forEach(item => {
          // Solo lo quemado o devuelto
          if (item.estado_entrada === 'utilizada' || item.estado_entrada === 'cancelada') {
            entradasPasadas.push(this._mapearItem(orden, item));
          }
        });
      }
    });

    return {
      entradasPasadas: entradasPasadas,
      productosPasados: [] // Listo para tus productos entregados futuros
    };
  }

  _mapearItem(orden, item) {
    let nombreEvento = 'Evento Desconocido';
    let tipoTicket = 'Entrada';

    if (item.tipoEntrada) {
      tipoTicket = item.tipoEntrada.nombre_tipo;
      if (item.tipoEntrada.eventoInfo) {
        nombreEvento = item.tipoEntrada.eventoInfo.nombre_evento; 
      }
    }

    return {
      id: item.id_entrada_vendida, // 🌟 FIX: ID único por ticket físico
      id_orden: orden.id_orden, 
      evento: `${nombreEvento} (${tipoTicket})`, 
      fecha: orden.fecha_orden,
      total: item.precio_pagado,
      codigo: item.codigo_unico,
      estado: item.estado_entrada
    };
  }

  _formatearOrdenes(ordenes) {
    let resultado = [];
    ordenes.forEach(orden => {
      if (orden.itemsDeOrden) {
        orden.itemsDeOrden.forEach(item => {
          resultado.push(this._mapearItem(orden, item));
        });
      }
    });
    return resultado;
  }
}

module.exports = GetMisCompras;