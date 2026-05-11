class CancelarPagoManual {
  constructor({ ordenesRepository, entradasVendidasRepository, tiposEntradasRepository }) {
    this.$ordenes = ordenesRepository;
    this.$entradas = entradasVendidasRepository;
    this.$tipos = tiposEntradasRepository;
  }

  async execute({ orden_id, user_id }) {
    const orden = await this.$ordenes.findOne({
  where: { id_orden: orden_id, id_usuario: user_id, estado_pago: 'pendiente' },
  // 👇 CAMBIAMOS ESTA LÍNEA: Usamos directamente el modelo que ya conoce Sequelize
  include: [{ association: 'itemsDeOrden' }] 
});

    if (!orden) return { mensaje: "La orden no se puede cancelar o no existe" };

    await orden.update({ estado_pago: 'cancelado' });

    await this.$entradas.update(
      { estado_entrada: 'cancelada' },
      { where: { id_orden: orden_id } }
    );

    // 🔄 Devolvemos stock manualmente
    for (const item of orden.itemsDeOrden) {
      await this.$tipos.incrementStock(item.id_tipo_entrada, 1);
    }

    return { mensaje: "Orden cancelada y stock devuelto con éxito", orden_id };
  }
}

module.exports = CancelarPagoManual;