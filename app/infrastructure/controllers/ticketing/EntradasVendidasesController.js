const { getResponseCustom } = require('../../libs/serviceUtil');

// Librerías mágicas para el PDF
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// 👇 1. IMPORTAMOS HASHIDS (El sastre que hace los disfraces)
const Hashids = require('hashids/cjs');
const hashids = new Hashids("GuidoTicketingSecret2026", 6, "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");

class EntradasVendidasesController {
  constructor({
    getEntradasVendidasesList,
    showEntradasVendidas,
    createEntradasVendidas,
    updateEntradasVendidas,
    deleteEntradasVendidas,
    getTicketByCodigo,
  }) {
    this.name = 'entradasVendidasesController';
    this.getEntradasVendidasesList = getEntradasVendidasesList;
    this.showEntradasVendidas = showEntradasVendidas;
    this.createEntradasVendidas = createEntradasVendidas;
    this.updateEntradasVendidas = updateEntradasVendidas;
    this.deleteEntradasVendidas = deleteEntradasVendidas;
    this.getTicketByCodigo = getTicketByCodigo;
  }

  async list(req, res, next) {
    try {
      const result = await this.getEntradasVendidasesList.execute();
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) { next(error); }
  }

  async show(req, res, next) {
    try {
      const { entradas_vendidas_id } = req.params;
      const result = await this.showEntradasVendidas.execute({ entradas_vendidas_id });
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const { column_1, column_2 } = req.body;
      const result = await this.createEntradasVendidas.execute({ column_1, column_2 });
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const { entradas_vendidas_id } = req.params;
      const { column_1, column_2 } = req.body;
      const result = await this.updateEntradasVendidas.execute({ entradas_vendidas_id, column_1, column_2 });
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const { entradas_vendidas_id } = req.params;
      const result = await this.deleteEntradasVendidas.execute({ entradas_vendidas_id });
      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) { next(error); }
  }

  // =================================================================
  // 🎟️ DESCARGAR PDF (AHORA CON CÓDIGO ENCRIPTADO)
  // =================================================================
  async downloadTicket(req, res, next) {
    try {
      const { codigo_unico } = req.params;
      
      // Armamos un código cortito y fácil de leer para el humano (ej: CA19BC80)
      const codigo_corto = codigo_unico.split('-')[0].toUpperCase();

      const entrada = await this.getTicketByCodigo.execute({ codigo_unico });

      // El QR guarda el código largo y ultra seguro para que la cámara no falle
      const qrBuffer = await QRCode.toBuffer(codigo_unico, {
        width: 120, margin: 0, color: { dark: '#000000', light: '#ffffff' }
      });

      const doc = new PDFDocument({ size: [600, 250], margin: 0 });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Ticket-${codigo_corto}.pdf`);
      doc.pipe(res);

      // --- FONDO IZQUIERDO ---
      let imagenUrlDB = entrada.tipoEntrada.eventoInfo.imagen_url || '';
      const nombreArchivo = imagenUrlDB.split('/').pop(); 
      const rutaImagen = path.join(__dirname, '../../../../public/images', nombreArchivo); 

      if (entrada.tipoEntrada.eventoInfo.imagen_url && fs.existsSync(rutaImagen)) {
        doc.save();
        doc.rect(0, 0, 450, 250).clip(); 
        doc.image(rutaImagen, 0, 0, { width: 450, height: 250, cover: [450, 250] });
        doc.restore();
        doc.rect(0, 0, 450, 250).fillOpacity(0.7).fill('#000000');
      } else {
        doc.rect(0, 0, 450, 250).fillOpacity(1).fill('#1f2937'); 
      }

      // --- TALÓN DERECHO ---
      doc.rect(450, 0, 150, 250).fillOpacity(1).fill('#ffffff');
      doc.lineWidth(2).dash(5, { space: 5 }).moveTo(450, 0).lineTo(450, 250).strokeColor('#cccccc').stroke();
      doc.undash(); 

      // --- TEXTOS ---
      doc.fillOpacity(1).fill('#48C9B0'); 
      doc.fontSize(24).text(entrada.tipoEntrada.eventoInfo.nombre_evento.toUpperCase(), 30, 30, { width: 400 });

      doc.fill('#ffffff');
      doc.fontSize(12).text('ENTRADA OFICIAL', 30, 65);
      doc.moveTo(30, 85).lineTo(420, 85).lineWidth(1).strokeColor('#ffffff').strokeOpacity(0.2).stroke();

      doc.fillOpacity(1).fill('#aaaaaa').fontSize(10).text('SECTOR / TIPO', 30, 110);
      doc.fill('#ffffff').fontSize(18).text(entrada.tipoEntrada.nombre_tipo.toUpperCase(), 30, 125);

      doc.fill('#aaaaaa').fontSize(10).text('A NOMBRE DE', 30, 170);
      doc.fill('#ffffff').fontSize(18).text(entrada.nombre_asistente.toUpperCase(), 30, 185);

      doc.image(qrBuffer, 465, 30, { width: 120 });

      // 👇 Acotamos el texto para que el humano lo pueda tipear fácil
      doc.fill('#333333').fontSize(9).text('CÓDIGO MANUAL:', 450, 165, { width: 150, align: 'center' });
      doc.fontSize(18).text(codigo_corto, 450, 180, { width: 150, align: 'center' });

      doc.fill('#888888').fontSize(8).text('Presentá este QR\npara ingresar', 450, 215, { width: 150, align: 'center' });

      doc.end();

    } catch (error) {
      console.error('[TICKET ERROR]', error);
      next(error);
    }
  }
}

module.exports = EntradasVendidasesController;