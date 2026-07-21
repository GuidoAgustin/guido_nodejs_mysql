// backend/app/infrastructure/repositories/ordeneses.repository.js
const CustomError = require('../../domain/exceptions/CustomError');

class OrdenesesRepository {
  constructor(models) {
    this.models = models;
  }

  async list() {
    const ordenes = await this.models.orden.findAll({
      order: [['fecha_orden', 'DESC']],
      include: [
        { 
          model: this.models.user, 
          as: 'comprador', 
        },
        { 
          model: this.models.entradas_vendidas, 
          as: 'itemsDeOrden',
          include: [
            {
              model: this.models.tipos_entrada,
              as: 'tipoEntrada',
              include: [{ model: this.models.evento, as: 'eventoInfo' }]
            }
          ]
        }
      ]
    });
    return ordenes;
  }

  // 🔥 MODO TSUNAMI: Trae la data pre-formateada y plana para el Dashboard
  async listForDashboard() {
    const ordenes = await this.models.orden.findAll({
      attributes: [
        ['id_orden', 'id'],
        ['monto_total', 'total'],
        ['fecha_orden', 'date'],
        ['estado_pago', 'status']
      ],
      order: [['fecha_orden', 'DESC']],
      include: [
        { 
          model: this.models.user, 
          as: 'comprador',
          attributes: [
            ['email', 'email'],
            ['first_name', 'nombre'], 
            ['last_name', 'apellido']
          ]
        },
        { 
          model: this.models.entradas_vendidas, 
          as: 'itemsDeOrden',
          attributes: ['id_entrada_vendida'], 
          include: [
            {
              model: this.models.tipos_entrada,
              as: 'tipoEntrada',
              attributes: ['id_tipo_entrada'],
              include: [{ 
                model: this.models.evento, 
                as: 'eventoInfo',
                attributes: ['nombre_evento'] 
              }]
            }
          ]
        }
      ]
    });

    return ordenes.map(orden => {
      const o = orden.toJSON();
      const comp = o.comprador || {};
      const nombreCliente = `${comp.nombre || ''} ${comp.apellido || ''}`.trim() || comp.email || 'Anónimo';

      let nombreEvento = 'Evento Desconocido';
      if (o.itemsDeOrden && o.itemsDeOrden.length > 0) {
        const primerItem = o.itemsDeOrden[0];
        if (primerItem.tipoEntrada && primerItem.tipoEntrada.eventoInfo) {
          nombreEvento = primerItem.tipoEntrada.eventoInfo.nombre_evento;
        }
      }

      return {
        id: o.id,
        eventName: nombreEvento,
        customerName: nombreCliente,
        quantity: o.itemsDeOrden ? o.itemsDeOrden.length : 0,
        total: parseFloat(o.total || 0).toFixed(2),
        date: o.date, 
        status: o.status || 'Desconocido'
      };
    });
  }

  /**
   * 🔥 MODO TSUNAMI: Busca la orden y aplica BLOQUEO DE FILA para evitar pagos duplicados
   */
  async findByIdWithItems(id_orden, { transaction, lock }) {
    const orden = await this.models.orden.findOne({
      where: { id_orden: id_orden },
      include: [
        {
          model: this.models.entradas_vendidas,
          as: 'itemsDeOrden'
        }
      ],
      transaction,
      lock 
    });
    return orden;
  }

  async show({ ordenes_id }) { 
    const orden = await this.models.orden.findByPk(ordenes_id, { 
      include: [
        { model: this.models.user, as: 'comprador' },
        { model: this.models.entradas_vendidas, as: 'itemsDeOrden', 
          include: [{model: this.models.tipos_entrada, as: 'tipoEntrada'}] } 
      ]
    });
    if (!orden) throw new CustomError('Orden no encontrada', 404); 
    return orden;
  }

  async create(datosOrden, transaction = null) {
    console.log('[OrdenesRepo] Creando orden con datos:', datosOrden);
    try {
      const nuevaOrden = await this.models.orden.create(datosOrden, { transaction }); 
      console.log('[OrdenesRepo] Orden creada:', nuevaOrden.toJSON());
      return nuevaOrden;
    } catch (error) {
      console.error('[OrdenesRepo] Error al crear orden:', error);
      throw new CustomError(`Error al crear la orden: ${error.message}`, 500, error);
    }
  }

async findOne(options) {
    const orden = await this.models.orden.findOne(options);
    return orden;
  }
  async delete({ ordenes_id }) { 
    const orden = await this.models.orden.findByPk(ordenes_id); 
    if (!orden) throw new CustomError('Orden no encontrada', 404);
    await orden.destroy();
    return orden;
  }
}

module.exports = OrdenesesRepository;