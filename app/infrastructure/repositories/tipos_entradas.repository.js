// backend/app/infrastructure/repositories/tipos_entradas.repository.js
const CustomError = require("../../domain/exceptions/CustomError");

class TiposEntradasRepository {
  constructor(models) {
    this.models = models; // models.tipos_entrada
  }

  // Listar tipos de entrada, opcionalmente filtrados por evento
  async list({ id_evento = null } = {}) {
    const where = id_evento ? { id_evento } : {};
    return this.models.tipos_entrada.findAll({
      where,
      order: [["nombre_tipo", "ASC"]],
    });
  }

  // Mostrar un tipo de entrada por su ID (usado para obtener detalles)
  async show({ tipos_entrada_id }) { // El parámetro es tipos_entrada_id
    const tipoEntrada = await this.models.tipos_entrada.findByPk(tipos_entrada_id);
    if (!tipoEntrada) {
      throw new CustomError("Tipo de entrada no encontrado", 404);
    }
    return tipoEntrada;
  }
  
  /**
   * Busca un tipo de entrada por su ID, permite opciones de transacción y bloqueo.
   * @param {number} id_tipo_entrada 
   * @param {object} [options={}] - Opciones de Sequelize (ej. { transaction, lock }).
   * @returns {Promise<Model|null>}
   */
  async findById(id_tipo_entrada, options = {}) {
    return this.models.tipos_entrada.findByPk(id_tipo_entrada, options);
  }

  // Crear un nuevo tipo de entrada
  async create(datosCreacion) {
    return this.models.tipos_entrada.create(datosCreacion);
  }

  // Actualizar un tipo de entrada (método general que ya tenías)
  async update({ 
    tipos_entrada_id, // El parámetro es tipos_entrada_id
    nombre_tipo,
    precio,
    cantidad_total,
    cantidad_disponible,
    descripcion_adicional,
   }, transaction = null) { // Añadido parámetro de transacción opcional
    const tipoEntrada = await this.models.tipos_entrada.findByPk(tipos_entrada_id, { transaction });
    if (!tipoEntrada) {
      throw new CustomError("Tipo de entrada no encontrado para actualizar", 404);
    }
  
    const dataToUpdate = {};
    if (nombre_tipo !== undefined) dataToUpdate.nombre_tipo = nombre_tipo;
    if (precio !== undefined) dataToUpdate.precio = parseFloat(precio);
    if (cantidad_total !== undefined) dataToUpdate.cantidad_total = parseInt(cantidad_total, 10);
    
    // Lógica para cantidad_disponible como la tenías
    if (cantidad_disponible !== undefined) {
      dataToUpdate.cantidad_disponible = parseInt(cantidad_disponible, 10);
    } else if (cantidad_total !== undefined && tipoEntrada.cantidad_total !== null && 
      tipoEntrada.cantidad_disponible !== null) {
      const vendidas = tipoEntrada.cantidad_total - tipoEntrada.cantidad_disponible;
      dataToUpdate.cantidad_disponible = parseInt(cantidad_total, 10) - vendidas;
      if (dataToUpdate.cantidad_disponible < 0) dataToUpdate.cantidad_disponible = 0;
    }
  
    if (descripcion_adicional !== undefined) dataToUpdate.descripcion_adicional = descripcion_adicional;
  
    if (Object.keys(dataToUpdate).length > 0) {
      await tipoEntrada.update(dataToUpdate, { transaction });
    }
    return tipoEntrada.reload({ transaction }); // Recargar para obtener el estado más reciente
  }

  /**
   * Decrementa el stock de un tipo de entrada específico.
   * @param {number} id_tipo_entrada
   * @param {number} cantidadADescontar
   * @param {object} transaction - Transacción de Sequelize OBLIGATORIA.
   * @returns {Promise<Model>} La instancia del tipo de entrada actualizada.
   */
  async decrementStock(id_tipo_entrada, cantidadADescontar, transaction) {
    if (!transaction) {
        throw new Error("Se requiere una transacción para decrementar el stock.");
    }
    // Usar findById para consistencia y para pasar la transacción y el bloqueo
    const tipoEntrada = await this.findById(id_tipo_entrada, { 
        transaction,
        lock: transaction.LOCK.UPDATE 
    });

    if (!tipoEntrada) {
        throw new CustomError(`Tipo de entrada con ID ${id_tipo_entrada} no encontrado para descontar stock.`, 404);
    }
    if (tipoEntrada.cantidad_disponible < cantidadADescontar) {
        throw new CustomError(`Stock insuficiente para "${tipoEntrada.nombre_tipo}". 
          Disponibles: ${tipoEntrada.cantidad_disponible}, Solicitadas: ${cantidadADescontar}.`, 409);
    }

    tipoEntrada.cantidad_disponible -= cantidadADescontar;
    await tipoEntrada.save({ transaction });
    return tipoEntrada;
  }

  // Borrar un tipo de entrada
  async delete({ tipos_entrada_id }, transaction = null) { // El parámetro es tipos_entrada_id
    const tipoEntrada = await this.models.tipos_entrada.findByPk(tipos_entrada_id, { transaction });
    if (!tipoEntrada) {
      throw new CustomError("Tipo de entrada no encontrado para borrar", 404);
    }
    await tipoEntrada.destroy({ transaction });
    return tipoEntrada;
  }
}

module.exports = TiposEntradasRepository;