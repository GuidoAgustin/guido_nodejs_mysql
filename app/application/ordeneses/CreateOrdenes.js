// backend/app/application/ordeneses/CreateOrdenes.js
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../../domain/exceptions/CustomError");

class CreateOrdenes {
  constructor(
    ordenesRepository,
    entradasVendidasRepository,
    tiposEntradasRepository,
    sequelize
  ) {
    this.ordenesRepository = ordenesRepository;
    this.entradasVendidasRepository = entradasVendidasRepository;
    this.tiposEntradasRepository = tiposEntradasRepository;
    this.sequelize = sequelize;
  }

  async execute({ id_usuario, nombre_comprador, email_comprador, items }) {
    if (!id_usuario || !items || !Array.isArray(items) || items.length === 0) {
      throw new CustomError(
        "Datos incompletos: Se requiere id_usuario y al menos un item.",
        400
      );
    }

    // Iniciar transacción de base de datos
    const t = await this.sequelize.transaction();

    try {
      let montoTotalCalculado = 0;
      const itemsParaProcesarConPrecioReal = [];

      // Verificar stock y obtener precios reales
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
            `Stock insuficiente para "${tipoEntrada.nombre_tipo}".
           Disponibles: ${tipoEntrada.cantidad_disponible}, Solicitadas: ${item.cantidad}.`,
            409
          );
        }

        itemsParaProcesarConPrecioReal.push({
          ...item,
          precio_real_unitario: parseFloat(tipoEntrada.precio),
        });
        montoTotalCalculado += item.cantidad * parseFloat(tipoEntrada.precio);
      }
      montoTotalCalculado = Math.round(montoTotalCalculado * 100) / 100;

      // Crear la orden
      const datosOrden = {
        id_usuario,
        monto_total: montoTotalCalculado,
      };
      const nuevaOrden = await this.ordenesRepository.create(datosOrden, t);

      // Crear las entradas vendidas
      for (const itemProcesado of itemsParaProcesarConPrecioReal) {
        for (let i = 0; i < itemProcesado.cantidad;) {
          const datosEntradaVendida = {
            id_orden: nuevaOrden.id_orden,
            id_tipo_entrada: itemProcesado.id_tipo_entrada,
            codigo_unico: uuidv4(),
            estado_entrada: "valida",
            precio_pagado: itemProcesado.precio_real_unitario,
            nombre_asistente: nombre_comprador,
            email_asistente: email_comprador,
          };
          await this.entradasVendidasRepository.create(datosEntradaVendida, t);
          i += 1;
        }
      }

      // Actualizar el stock
      for (const itemProcesado of itemsParaProcesarConPrecioReal) {
        await this.tiposEntradasRepository.decrementStock(
          itemProcesado.id_tipo_entrada,
          itemProcesado.cantidad,
          t
        );
      }

      await t.commit(); // Confirmar la transacción

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
