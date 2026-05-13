const EscanerService = require('../../../application/adminTicketing/escaner.service');

const validarTicket = async (req, res) => {
  try {
    // El celular nos va a mandar el código QR escaneado en el body
    const { codigo_qr } = req.body;

    if (!codigo_qr) {
      return res.status(400).json({ error: 'Falta el código de la entrada.' });
    }

    // Le pasamos el código al patovica digital
    const resultado = await EscanerService.validarEntrada(codigo_qr);

    // Devolvemos el resultado al celular (ya sea verde, rojo o negro)
    return res.status(200).json(resultado);

  } catch (error) {
    console.error('Error en validarTicket:', error);
    return res.status(500).json({ error: 'Error al procesar la entrada.' });
  }
};

module.exports = {
  validarTicket
};
