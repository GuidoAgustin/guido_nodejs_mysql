// backend/app/infrastructure/repositories/entradas_vendidases.repository.js
const CustomError = require('../../domain/exceptions/CustomError');

class EntradasVendidasesRepository {
  constructor(models) {
    this.models = models; 
  }

  async list() {
    const entradasVendidas = await this.models.entradas_vendidas.findAll({
      order: [['id_entrada_vendida', 'ASC']], 
    });
    return entradasVendidas;
  }

  async show({ entradas_vendidas_id }) {
    const entradaVendida = await this.models.entradas_vendidas.findByPk(entradas_vendidas_id);
    if (!entradaVendida) {
      throw new CustomError('Entrada vendida no encontrada', 404);
    }
    return entradaVendida;
  }

  async getByCodigoUnico(codigo_unico) {
    const entradaVendida = await this.models.entradas_vendidas.findOne({
      where: { codigo_unico },
      include: [
        { 
          model: this.models.tipos_entrada, 
          as: 'tipoEntrada',
          include: [
            { 
              model: this.models.evento, 
              as: 'eventoInfo' 
            }
          ]
        }
      ]
    });

    if (!entradaVendida) {
      throw new CustomError('Ticket no encontrado', 404);
    }
    
    return entradaVendida;
  }

  async create(datosEntrada, transaction = null) {
    try {
      const nuevaEntradaVendida = await this.models.entradas_vendidas.create(datosEntrada, { transaction });
      return nuevaEntradaVendida;
    } catch (error) {
      throw new CustomError(`Error al crear entrada vendida: ${error.message}`, 500, error.errors);
    }
  }

  async bulkCreate(arrayDeEntradas, transaction = null) {
    try {
      const nuevasEntradas = await this.models.entradas_vendidas.bulkCreate(arrayDeEntradas, { transaction });
      return nuevasEntradas;
    } catch (error) {
      throw new CustomError(`Error masivo al crear entradas vendidas: ${error.message}`, 500, error.errors);
    }
  }

  /**
   * 🔥 MODO TSUNAMI: Actualiza múltiples entradas asociadas a una orden de un plumazo
   */
  async updateByOrdenId({ id_orden, datosAActualizar }, transaction = null) {
    try {
      const resultado = await this.models.entradas_vendidas.update(
        datosAActualizar,
        {
          where: { id_orden: id_orden },
          transaction
        }
      );
      return resultado;
    } catch (error) {
      throw new CustomError(`Error al actualizar entradas masivamente: ${error.message}`, 500);
    }
  }

  async update({ entradas_vendidas_id, datosAActualizar }, transaction = null) {
    const entradaVendida = await this.models.entradas_vendidas.findByPk(entradas_vendidas_id, { transaction });
    if (!entradaVendida) {
      throw new CustomError('Entrada vendida no encontrada para actualizar', 404);
    }
    await entradaVendida.update(datosAActualizar, { transaction });
    return entradaVendida.reload({ transaction }); 
  }

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