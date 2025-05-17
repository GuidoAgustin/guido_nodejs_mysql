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
    id_evento,
    nombre_tipo,
    precio,
    cantidad_total,
    cantidad_disponible,
    descripcion_adicional,
  }) {
    return this.models.tipos_entrada.create({
      id_evento,
      nombre_tipo,
      precio,
      cantidad_total,
      cantidad_disponible,
      descripcion_adicional,
    });
  }

  async update({
    tipos_entrada_id,
    nombre_tipo,
    precio,
    cantidad_total,
    cantidad_disponible,
    descripcion_adicional,
  }) {
    const tipos_entrada = await this.models.tipos_entrada.findByPk(
      tipos_entrada_id
    );
    if (!tipos_entrada) throw new CustomError("tipos_entrada not found", 404);
    await tipos_entrada.update({
      nombre_tipo,
      precio,
      cantidad_total,
      cantidad_disponible,
      descripcion_adicional,
    });
    return tipos_entrada;
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
