// backend/app/infrastructure/repositories/entradas_vendidases.repository.js
const CustomError = require('../../domain/exceptions/CustomError');

class EntradasVendidasesRepository {
  constructor(models) {
    // models.entradas_vendidas debe ser tu modelo Sequelize
    this.models = models; 
  }

  // Listar todas las entradas vendidas (ejemplo de ordenación)
  async list() {
    const entradasVendidas = await this.models.entradas_vendidas.findAll({
      order: [['id_entrada_vendida', 'ASC']], // Ordenar por ID o fecha_compra si la tuvieras aquí
      // Considera incluir modelos relacionados si es necesario
      // include: [{ model: this.models.orden }, { model: this.models.tipos_entrada }]
    });
    return entradasVendidas;
  }

  // Mostrar una entrada vendida específica por su ID
  async show({ entradas_vendidas_id }) {
    const entradaVendida = await this.models.entradas_vendidas.findByPk(entradas_vendidas_id);
    if (!entradaVendida) {
      throw new CustomError('Entrada vendida no encontrada', 404);
    }
    return entradaVendida;
  }

  /**
   * Crea un nuevo registro de entrada vendida.
   * @param {object} datosEntrada - Datos para la entrada vendida.
   * @param {object} [transaction=null] - Transacción de Sequelize opcional.
   * @returns {Promise<Model>} La instancia de la entrada vendida creada.
   */
  async create(datosEntrada, transaction = null) {
    try {
      // Usar this.models.entradas_vendidas para acceder al modelo
      const nuevaEntradaVendida = await this.models.entradas_vendidas.create(datosEntrada, { transaction });
      return nuevaEntradaVendida;
    } catch (error) {
      // console.error('[EntradasVendidasRepo] Error al crear entrada vendida:', error);
      throw new CustomError(`Error al crear entrada vendida: ${error.message}`, 500, error.errors);
    }
  }

  // Actualizar una entrada vendida (método genérico, podría no ser usado para el flujo de compra)
  async update({ entradas_vendidas_id, datosAActualizar }, transaction = null) {
    const entradaVendida = await this.models.entradas_vendidas.findByPk(entradas_vendidas_id, { transaction });
    if (!entradaVendida) {
      throw new CustomError('Entrada vendida no encontrada para actualizar', 404);
    }
    await entradaVendida.update(datosAActualizar, { transaction });
    return entradaVendida.reload({ transaction }); // Recargar para obtener el estado más reciente
  }

  // Borrar una entrada vendida
  async delete({ entradas_vendidas_id }, transaction = null) {
    const entradaVendida = await this.models.entradas_vendidas.findByPk(entradas_vendidas_id, { transaction });
    if (!entradaVendida) {
      throw new CustomError('Entrada vendida no encontrada para borrar', 404);
    }
    await entradaVendida.destroy({ transaction });
    return entradaVendida;
  }
}

module.exports = EntradasVendidasesRepository;