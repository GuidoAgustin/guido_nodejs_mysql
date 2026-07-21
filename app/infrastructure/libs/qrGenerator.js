const QRCode = require('qrcode');

/**
 * Genera un Código QR en formato Base64 (Data URI)
 * @param {string} text - El texto o link que va a contener el QR
 * @returns {Promise<string>} - El string de la imagen lista para inyectar en HTML
 */
const generateQRBase64 = async (text) => {
  try {
    // Generamos el QR rapidísimo en memoria
    const qrDataUri = await QRCode.toDataURL(text, { margin: 1, width: 300 });
    return qrDataUri;
  } catch (err) {
    console.error("Error generando el QR:", err);
    throw new Error("No se pudo generar el código QR de la entrada");
  }
};

module.exports = {
  generateQRBase64
};