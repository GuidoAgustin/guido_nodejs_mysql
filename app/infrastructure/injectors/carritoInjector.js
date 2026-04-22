const GetMisCompras = require('../../application/carrito/GetMisCompras');
const CarritoController = require('../controllers/CarritoController');

module.exports = ({ models }) => {
  const getMisCompras = new GetMisCompras({
    ordenesRepository: models.orden,
    entradasVendidasRepository: models.entradas_vendidas,
    // 👇 Agregamos estos dos modelos 👇
    tiposEntradaRepository: models.tipos_entrada,
    eventoRepository: models.evento
  });

  const carritoController = new CarritoController({
    getMisCompras
  });

  return carritoController;
};