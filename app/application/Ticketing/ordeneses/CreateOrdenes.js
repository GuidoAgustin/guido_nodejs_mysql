const { v4: uuidv4 } = require("uuid");
const CustomError = require("../../../domain/exceptions/CustomError");

class CreateOrdenes {
  constructor(
    ordenesRepository,
    entradasVendidasRepository,
    tiposEntradasRepository,
    eventosRepository,
    sequelize
  ) {
    this.ordenesRepository = ordenesRepository;
    this.entradasVendidasRepository = entradasVendidasRepository;
    this.tiposEntradasRepository = tiposEntradasRepository;
    this.eventosRepository = eventosRepository;
    this.sequelize = sequelize;
  }

  async execute({ id_usuario, nombre_comprador, email_comprador, items }) {
    if (!id_usuario || !items || !Array.isArray(items) || items.length === 0) {
      throw new CustomError(
        "Datos incompletos: Se requiere id_usuario y al menos un item.",
        400
      );
    }

    // 🔥 EL FIX ANTI-DEADLOCK (Intacto)
    items.sort((a, b) => a.id_tipo_entrada - b.id_tipo_entrada);

    const t = await this.sequelize.transaction();
    let eventoIdParaVerificar = null;

    try {
      let montoTotalCalculado = 0;
      const itemsParaProcesarConPrecioReal = [];

      // 1. Verificar stock y obtener precios reales
      for (const item of items) {
        const tipoEntrada = await this.tiposEntradasRepository.findById(
          item.id_tipo_entrada,
          {
            transaction: t,
            lock: t.LOCK.UPDATE,
          }
        );

        if (!tipoEntrada) {
          throw new CustomError(
            `El tipo de entrada con ID ${item.id_tipo_entrada} no existe.`,
            404
          );
        }
        if (tipoEntrada.cantidad_disponible < item.cantidad) {
          throw new CustomError(
            `Stock insuficiente para "${tipoEntrada.nombre_tipo}". Disponibles: ${tipoEntrada.cantidad_disponible}, Solicitadas: ${item.cantidad}.`,
            409
          );
        }

        eventoIdParaVerificar = tipoEntrada.id_evento;
        itemsParaProcesarConPrecioReal.push({
          ...item,
          precio_real_unitario: parseFloat(tipoEntrada.precio),
        });
        montoTotalCalculado += item.cantidad * parseFloat(tipoEntrada.precio);
      }
      
      // Aseguramos precisión de decimales para evitar bugs de coma flotante
      montoTotalCalculado = Math.round(montoTotalCalculado * 100) / 100;

      // 2. Crear la orden
      const datosOrden = { id_usuario, monto_total: montoTotalCalculado };
      const nuevaOrden = await this.ordenesRepository.create(datosOrden, t);

      // 3. Crear las entradas vendidas (MODO TSUNAMI ACTIVADO 🌊)
      const entradasACrear = [];
      for (const itemProcesado of itemsParaProcesarConPrecioReal) {
        for (let i = 0; i < itemProcesado.cantidad; i++) {
          entradasACrear.push({
            id_orden: nuevaOrden.id_orden,
            id_tipo_entrada: itemProcesado.id_tipo_entrada,
            codigo_unico: uuidv4(),
            estado_entrada: "valida",
            precio_pagado: itemProcesado.precio_real_unitario,
            nombre_asistente: nombre_comprador,
            email_asistente: email_comprador,
          });
        }
      }
      
      // ¡BUM! Un solo viaje a la base de datos
      await this.entradasVendidasRepository.bulkCreate(entradasACrear, t);

      // 4. Actualizar el stock
      for (const itemProcesado of itemsParaProcesarConPrecioReal) {
        await this.tiposEntradasRepository.decrementStock(
          itemProcesado.id_tipo_entrada,
          itemProcesado.cantidad,
          t
        );
      }

      await t.commit(); // Confirmar la transacción

      // 5. Verificar si el evento se agotó
      if (eventoIdParaVerificar) {
        const todosLosTiposDelEvento = await this.tiposEntradasRepository.list({
          id_evento: eventoIdParaVerificar,
        });
        const stockTotalRestante = todosLosTiposDelEvento.reduce(
          (sum, tipo) => sum + tipo.cantidad_disponible,
          0
        );

        if (stockTotalRestante === 0) {
          const datosParaActualizar = { estado_evento: "agotado" };
          await this.eventosRepository.update({
            evento_id: eventoIdParaVerificar,
            updateData: datosParaActualizar,
          });
        }
      }

      // Devolver la orden creada con sus items asociados
      return this.ordenesRepository.show({ ordenes_id: nuevaOrden.id_orden });
      
    } catch (error) {
      await t.rollback(); // Revertir todos los cambios si algo falla
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        `Error al procesar la orden: ${error.message}`,
        500,
        error.errors || error
      );
    }
  }
}

module.exports = CreateOrdenes;