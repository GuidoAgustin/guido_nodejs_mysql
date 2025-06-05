// backend/app/infrastructure/repositories/ordeneses.repository.js
const CustomError = require('../../domain/exceptions/CustomError');

class OrdenesesRepository {
  constructor(models) {
    this.models = models;
  }

  async list() {
    // Asumiendo que quieres ordenar por fecha de orden descendente
    const ordenes = await this.models.orden.findAll({ // Usando this.models.orden
      order: [['fecha_orden', 'DESC']],
      include: [{ model: this.models.user, as: 'comprador', attributes: ['user_id', 'email', 'nombre'] }]
    });
    return ordenes;
  }

  async show({ ordenes_id }) { // El parámetro es 'ordenes_id', pero la PK es 'id_orden'
    const orden = await this.models.orden.findByPk(ordenes_id, { // Usando this.models.orden
      include: [
        { model: this.models.user, as: 'comprador' },
        { model: this.models.entradas_vendidas, as: 'itemsDeOrden', 
          include: [{model: this.models.tipos_entrada, as: 'tipoEntrada'}] } // Ejemplo anidado
      ]
    });
    if (!orden) throw new CustomError('Orden no encontrada', 404); // Mensaje en español
    return orden;
  }

  /**
   * Crea una nueva orden.
   * @param {object} datosOrden - Objeto con los datos de la orden a crear.
   * @param {object} [transaction=null] - Transacción opcional de Sequelize.
   * @returns {Promise<Model>} La instancia de la orden creada.
   */
  async create(datosOrden, transaction = null) {
    console.log('[OrdenesRepo] Creando orden con datos:', datosOrden);
    try {
      // datosOrden debe contener: id_usuario, monto_total
      // fecha_orden y estado_pago tendrán valores por defecto.
      const nuevaOrden = await this.models.orden.create(datosOrden, { transaction }); // Usando this.models.orden
      console.log('[OrdenesRepo] Orden creada:', nuevaOrden.toJSON());
      return nuevaOrden;
    } catch (error) {
      console.error('[OrdenesRepo] Error al crear orden:', error);
      throw new CustomError(`Error al crear la orden: ${error.message}`, 500, error);
    }
  }

  // El método update también necesitaría ser adaptado si lo vas a usar
  async update({ ordenes_id, datosAActualizar }, transaction = null) { // 'ordenes_id' vs 'id_orden'
    console.log(`[OrdenesRepo] Actualizando orden ID ${ordenes_id} con datos:`, datosAActualizar);
    const orden = await this.models.orden.findByPk(ordenes_id, { transaction }); // Usando this.models.orden

    if (!orden) {
      console.error(`[OrdenesRepo] Orden ID ${ordenes_id} no encontrada para actualizar.`);
      throw new CustomError('Orden no encontrada', 404);
    }
    
    await orden.update(datosAActualizar, { transaction });
    console.log('[OrdenesRepo] Orden actualizada.');
    return orden.reload({ transaction }); // Recargar para obtener el estado más reciente
  }

  async delete({ ordenes_id }) { // 'ordenes_id' vs 'id_orden'
    const orden = await this.models.orden.findByPk(ordenes_id); // Usando this.models.orden
    if (!orden) throw new CustomError('Orden no encontrada', 404);
    await orden.destroy();
    return orden;
  }
}

module.exports = OrdenesesRepository;