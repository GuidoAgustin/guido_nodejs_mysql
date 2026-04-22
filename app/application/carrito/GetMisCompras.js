class GetMisCompras {
  // 1. Recibimos los 4 repositorios
  constructor({ ordenesRepository, entradasVendidasRepository, tiposEntradaRepository, eventoRepository }) {
    this.$ordenes = ordenesRepository;
    this.$entradasVendidas = entradasVendidasRepository;
    this.$tiposEntrada = tiposEntradaRepository;
    this.$evento = eventoRepository;
  }

  async execute({ user_id }) {
    if (!user_id) throw new Error('El ID de usuario es requerido');

    try {
      // Armamos la consulta profunda que vamos a reusar
      const queryInception = {
        model: this.$entradasVendidas,
        as: 'itemsDeOrden',
        include: [
          {
            model: this.$tiposEntrada,
            as: 'tipoEntrada',
            include: [
              {
                model: this.$evento,
                as: 'eventoInfo'
              }
            ]
          }
        ]
      };

      // 2. Buscar órdenes
      const ordenesPendientes = await this.$ordenes.findAll({
        where: { id_usuario: user_id, estado_pago: 'pendiente' },
        include: [queryInception]
      });

      const ordenesPagadas = await this.$ordenes.findAll({
        where: { id_usuario: user_id, estado_pago: 'pagado' },
        include: [queryInception]
      });

      return {
        entradasPendientes: this._formatearOrdenes(ordenesPendientes),
        entradasProximas: this._formatearOrdenes(ordenesPagadas), 
        entradasPasadas: [], 
        productosPendientes: [], 
        productosActivos: [],
        productosPasados: []
      };

    } catch (error) {
      console.error("💥 ERROR EN BASE DE DATOS:", error);
      throw error;
    }
  }

  _formatearOrdenes(ordenes) {
    let resultado = [];
    
    ordenes.forEach(orden => {
      if (orden.itemsDeOrden && orden.itemsDeOrden.length > 0) {
        orden.itemsDeOrden.forEach(item => {
          
          // 👇 ACÁ ARMAMOS EL NOMBRE HERMOSO PARA EL FRONTEND 👇
          let nombreEvento = 'Evento Desconocido';
          let tipoTicket = 'Entrada';

          if (item.tipoEntrada) {
            tipoTicket = item.tipoEntrada.nombre_tipo;
            if (item.tipoEntrada.eventoInfo) {
              nombreEvento = item.tipoEntrada.eventoInfo.nombre_evento; 
            }
          }

          resultado.push({
            id: orden.id_orden, // Cuidado, el ID de la orden es el que vamos a usar para pagar en MP
            evento: `${nombreEvento} (${tipoTicket})`, // Queda: "Lollapalooza (VIP)"
            fecha: orden.fecha_orden,
            total: item.precio_pagado,
            codigo: item.codigo_unico
          });
        });
      }
    });

    return resultado;
  }
}

module.exports = GetMisCompras;