class ConfirmarPagoManual {
  constructor({ ordenesRepository }) {
    this.$ordenes = ordenesRepository;
  }

  async execute({ orden_id, user_id }) {
    // Buscamos la orden que sea del usuario y esté pendiente
    const orden = await this.$ordenes.findOne({
      where: { id_orden: orden_id, id_usuario: user_id, estado_pago: 'pendiente' }
    });

    if (!orden) return { mensaje: "La orden ya estaba pagada o no existe" };

    // Actualizamos el estado
    await orden.update({ estado_pago: 'pagado' });

    return { mensaje: "Orden pagada con éxito", orden_id };
  }
}

module.exports = ConfirmarPagoManual;