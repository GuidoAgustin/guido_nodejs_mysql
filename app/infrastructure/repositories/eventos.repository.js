
const CustomError = require('../../domain/exceptions/CustomError');

class EventosRepository {
  constructor(models) {
    this.models = models;
  }

  async list() {
    try {
      return await this.models.evento.findAll({
        order: [['evento_id', 'asc']],
        include: [
          {
            model: this.models.tipos_entrada,
            as: 'tipos_entrada',
            attributes: [
              'id_tipo_entrada',
              'nombre_tipo',
              'precio',
              'cantidad_total',
              'cantidad_disponible',
              'descripcion_adicional',
            ],
          },
        ],
      });
    } catch (err) {
      console.error('⚠️ EventosRepository.list fallo:', err.message);
      throw err;
    }
  }

  async show({ evento_id }) {
    const evento = await this.models.evento.findByPk(evento_id, {
      include: [
        {
          model: this.models.tipos_entrada,
          as: 'tipos_entrada',
          attributes: [
            'id_tipo_entrada',
            'nombre_tipo',
            'precio',
            'cantidad_total',
            'cantidad_disponible',
            'descripcion_adicional',
          ],
        },
      ],
    });
  
    if (!evento) throw new CustomError('evento not found', 404);
  
    return evento;
  }

  async create({
    nombre_evento,
    descripcion,
    fecha_hora_inicio,
    fecha_hora_fin,
    lugar_nombre,
    lugar_direccion,
    categoria,
    imagen_url,
    estado_evento
  }) {
    const evento = await this.models.evento.create({
      nombre_evento,
      descripcion,
      fecha_hora_inicio,
      fecha_hora_fin,
      lugar_nombre,
      lugar_direccion,
      categoria,
      imagen_url,
      estado_evento
    });
    return evento;
  }

  async update({ evento_id, updateData }) { // updateData contendrá todos los campos a actualizar
    const evento = await this.models.evento.findByPk(evento_id);

    if (!evento) {
      throw new CustomError('Evento no encontrado', 404);
    }

    // 'updateData' es un objeto con los campos a modificar.
    // Sequelize se encarga de actualizar solo los campos presentes en updateData.
    await evento.update(updateData);

    // Devolver la instancia actualizada con sus asociaciones (similar a show/list)
    return this.models.evento.findByPk(evento_id, {
      include: [
        {
          model: this.models.tipos_entrada,
          as: 'tipos_entrada',
          attributes: [
            'id_tipo_entrada',
            'nombre_tipo',
            'precio',
            'cantidad_total',
            'cantidad_disponible',
            'descripcion_adicional',
          ],
        },
      ],
    });
  }

  async delete({ evento_id }) {
    const evento = await this.models.evento.findByPk(evento_id);

    if (!evento) throw new CustomError('evento not found', 404);

    await evento.destroy();

    return evento;
  }
}

module.exports = EventosRepository;
