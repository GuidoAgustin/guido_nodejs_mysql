const db = require('../../models');
// Importamos los operadores lógicos de Sequelize (para usar el "LIKE")
const { Op } = require('sequelize');

class EscanerService {
  static async validarEntrada(codigo_recibido) {
    try {
      // Limpiamos el código por si el patovica le metió un espacio sin querer
      const codigo_limpio = codigo_recibido.trim();

      // 1. Buscamos la entrada inteligente (Que el código empiece con lo que se escaneó/tipeó)
      // 🔥 ESCUDO: Exigimos que tipeen el código corto completo (mínimo 6 caracteres)
      if (codigo_limpio.length < 6) {
        return { 
          valido: false, 
          color: 'negro', 
          mensaje: 'CÓDIGO INVÁLIDO: El código ingresado es demasiado corto.' 
        };
      }

      // 1. Buscamos la entrada inteligente (Ahora es 100% seguro usar LIKE)
      const entrada = await db.entradas_vendidas.findOne({
        where: {
          codigo_unico: {
            [Op.like]: `${codigo_limpio}%` 
          }
        },
        include: [{
          model: db.tipos_entrada,
          as: 'tipoEntrada',
          attributes: ['nombre_tipo', 'id_evento']
        }]
      });

      // ⚫ SEMÁFORO NEGRO: La entrada no existe o se tipeó mal
      if (!entrada) {
        return { 
          valido: false, 
          color: 'negro', 
          mensaje: 'CÓDIGO INVÁLIDO: La entrada no existe en el sistema.' 
        };
      }

      // ⚫ SEMÁFORO NEGRO: La entrada fue cancelada
      if (entrada.estado_entrada === 'cancelada') {
        return { 
          valido: false, 
          color: 'negro', 
          mensaje: 'ACCESO DENEGADO: Esta entrada fue cancelada o devuelta.' 
        };
      }

      // 🔴 SEMÁFORO ROJO: ¡Alguien quiere pasar dos veces!
      if (entrada.estado_entrada === 'utilizada') {
        return { 
          valido: false, 
          color: 'rojo', 
          mensaje: '¡ALERTA! Esta entrada YA FUE UTILIZADA.' 
        };
      }

      // 🟢 SEMÁFORO VERDE: Todo perfecto, la marcamos como usada y lo dejamos pasar
      if (entrada.estado_entrada === 'valida') {
        entrada.estado_entrada = 'utilizada';
        await entrada.save();

        return { 
          valido: true, 
          color: 'verde', 
          mensaje: '¡ACCESO PERMITIDO!',
          datosEntrada: {
            tipo: entrada.tipoEntrada ? entrada.tipoEntrada.nombre_tipo : 'General'
          }
        };
      }

      return { valido: false, color: 'negro', mensaje: 'Error: Estado de entrada desconocido.' };

    } catch (error) {
      console.error('Error en EscanerService:', error);
      throw new Error('Error interno al validar la entrada.');
    }
  }
}

module.exports = EscanerService;