const CustomError = require("../../domain/exceptions/CustomError");

class TiposEntradasRepository {
  constructor(models) {
    this.models = models;
  }

  /**
   * Si id_evento está presente, filtra por ese evento;
   * si no, devuelve todos los tipos.
   */
  async list({ id_evento = null } = {}) {
    const where = id_evento ? { id_evento } : {};
    return this.models.tipos_entrada.findAll({
      where,
      order: [["nombre_tipo", "ASC"]],
    });
  }

  async show({ tipos_entrada_id }) {
    const tipos_entrada = await this.models.tipos_entrada.findByPk(
      tipos_entrada_id
    );
    if (!tipos_entrada) throw new CustomError("tipos_entrada not found", 404);
    return tipos_entrada;
  }

  async create({
    id_evento, nombre_tipo, precio,
    cantidad_total, cantidad_disponible, descripcion_adicional
  }) {
    return this.models.tipos_entrada.create({
      id_evento,
      nombre_tipo,
      precio,
      cantidad_total,
      cantidad_disponible,
      descripcion_adicional
    });
  }

  async update({ // Recibe campos individuales
    tipos_entrada_id,
    nombre_tipo,
    precio,
    cantidad_total,
    cantidad_disponible, // Cliente puede enviar esto.
    descripcion_adicional,
  }) {
    const tipos_entrada = await this.models.tipos_entrada.findByPk(
      tipos_entrada_id
    );
    if (!tipos_entrada) throw new CustomError("Tipo de entrada no encontrado", 404);
  
    const dataToUpdate = {};
    // Solo añadir al objeto de actualización si el valor no es undefined
    if (nombre_tipo !== undefined) dataToUpdate.nombre_tipo = nombre_tipo;
    if (precio !== undefined) dataToUpdate.precio = parseFloat(precio);
    if (cantidad_total !== undefined) dataToUpdate.cantidad_total = parseInt(cantidad_total, 10);
  
    // Lógica para cantidad_disponible si cantidad_total cambia:
    // Si se actualiza cantidad_total y cantidad_disponible no se envía explícitamente,
    // se podría ajustar cantidad_disponible en proporción o según reglas de negocio.
    // Por ahora, si el cliente envía cantidad_disponible, se usa.
    // Si no la envía, no se toca (a menos que la lógica de abajo se implemente).
    if (cantidad_disponible !== undefined) {
      dataToUpdate.cantidad_disponible = parseInt(cantidad_disponible, 10);
    } else if (cantidad_total !== undefined) {
      // Ejemplo: Si cantidad_total cambia y cantidad_disponible no se especifica,
      // ajustarla manteniendo la misma cantidad de entradas vendidas.
      // Esto es una lógica de ejemplo y puede necesitar ser más robusta.
      const vendidas = tipos_entrada.cantidad_total - tipos_entrada.cantidad_disponible;
      dataToUpdate.cantidad_disponible = parseInt(cantidad_total, 10) - vendidas;
      if (dataToUpdate.cantidad_disponible < 0) dataToUpdate.cantidad_disponible = 0; // No puede ser negativa
    }
  
    if (descripcion_adicional !== undefined) dataToUpdate.descripcion_adicional = descripcion_adicional;
  
    if (Object.keys(dataToUpdate).length > 0) {
        await tipos_entrada.update(dataToUpdate);
    }
    return tipos_entrada; // Devuelve la instancia actualizada
  }

  async delete({ tipos_entrada_id }) {
    const tipos_entrada = await this.models.tipos_entrada.findByPk(
      tipos_entrada_id
    );
    if (!tipos_entrada) throw new CustomError("tipos_entrada not found", 404);
    await tipos_entrada.destroy();
    return tipos_entrada;
  }
}

module.exports = TiposEntradasRepository;
