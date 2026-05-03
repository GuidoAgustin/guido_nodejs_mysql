const { getResponseCustom } = require('../../libs/serviceUtil');

// Librerías mágicas para el PDF
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

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
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { entradas_vendidas_id } = req.params;

      const result = await this.showEntradasVendidas.execute({
        entradas_vendidas_id,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { column_1, column_2 } = req.body;

      const result = await this.createEntradasVendidas.execute({
        column_1,
        column_2,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { entradas_vendidas_id } = req.params;
      const { column_1, column_2 } = req.body;

      const result = await this.updateEntradasVendidas.execute({
        entradas_vendidas_id,
        column_1,
        column_2,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { entradas_vendidas_id } = req.params;

      const result = await this.deleteEntradasVendidas.execute({
        entradas_vendidas_id,
      });

      res.status(200).send(getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  // NUEVO MÉTODO: Descargar PDF (¡Corregido con las relaciones exactas!)
// NUEVO MÉTODO: Descargar PDF (Versión Premium Completa 🎟️)
  async downloadTicket(req, res, next) {
    try {
      const { codigo_unico } = req.params;
      
      // 🔥 LA TRAMPA: Esto nos avisa si la ruta funciona
      console.log("🎟️ ¡ALERTA! Alguien pidió el ticket con código:", codigo_unico);

      // 1. Usamos la arquitectura limpia para ir a buscar los datos
      const entrada = await this.getTicketByCodigo.execute({ codigo_unico });

      // 2. Generamos el QR (sin margen para que encastre perfecto en la zona blanca)
      const qrBuffer = await QRCode.toBuffer(codigo_unico, {
        width: 120, margin: 0, color: { dark: '#000000', light: '#ffffff' }
      });

      // 3. Creamos el lienzo del PDF (600x250)
      const doc = new PDFDocument({ size: [600, 250], margin: 0 });

      // Enganchamos el archivo a la respuesta del navegador
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Ticket-${codigo_unico}.pdf`);
      doc.pipe(res);

      // --- SECCIÓN IZQUIERDA: FONDO Y DISEÑO OSCURO (450px de ancho) ---
      
     // A. Resolvemos la ruta de la foto con el "Bisturí" 🔪
      let imagenUrlDB = entrada.tipoEntrada.eventoInfo.imagen_url || '';
      
      // Magia pura: Cortamos el texto cada vez que hay una barra '/' y nos quedamos con el último pedacito (el nombre de la foto)
      const nombreArchivo = imagenUrlDB.split('/').pop(); 

      // Armamos la ruta perfecta: Disco Duro + public/images + nombre_de_la_foto
      const rutaImagen = path.join(__dirname, '../../../../public/images', nombreArchivo); 

      // B. Dibujamos el fondo
      if (entrada.tipoEntrada.eventoInfo.imagen_url && fs.existsSync(rutaImagen)) {
        // Enmascaramos la imagen para que no pise el área blanca del QR
        doc.save();
        doc.rect(0, 0, 450, 250).clip(); 
        doc.image(rutaImagen, 0, 0, { width: 450, height: 250, cover: [450, 250] });
        doc.restore();
        
        // Le ponemos un vidrio polarizado (negro al 70%) arriba para que la letra blanca se lea
        doc.rect(0, 0, 450, 250).fillOpacity(0.7).fill('#000000');
      } else {
        // Plan B: Fondo liso elegante si el evento no tiene foto o falla la ruta
        doc.rect(0, 0, 450, 250).fillOpacity(1).fill('#1f2937'); 
      }

      // --- SECCIÓN DERECHA: EL TALÓN BLANCO PARA EL QR (150px de ancho) ---
      doc.rect(450, 0, 150, 250).fillOpacity(1).fill('#ffffff');

      // --- LA LÍNEA DE CORTE (Línea punteada) ---
      doc.lineWidth(2).dash(5, { space: 5 }).moveTo(450, 0).lineTo(450, 250).strokeColor('#cccccc').stroke();
      doc.undash(); // Reiniciamos el pincel para no hacer todo punteado

      // --- TEXTOS SECCIÓN IZQUIERDA ---
      // Título del evento (Color Cyan/Teal)
      doc.fillOpacity(1).fill('#48C9B0'); 
      doc.fontSize(24).text(entrada.tipoEntrada.eventoInfo.nombre_evento.toUpperCase(), 30, 30, { width: 400 });

      doc.fill('#ffffff');
      doc.fontSize(12).text('ENTRADA OFICIAL', 30, 65);
      
      // Línea separadora sutil
      doc.moveTo(30, 85).lineTo(420, 85).lineWidth(1).strokeColor('#ffffff').strokeOpacity(0.2).stroke();

      // Sector y Tipo
      doc.fillOpacity(1).fill('#aaaaaa').fontSize(10).text('SECTOR / TIPO', 30, 110);
      doc.fill('#ffffff').fontSize(18).text(entrada.tipoEntrada.nombre_tipo.toUpperCase(), 30, 125);

      // Asistente
      doc.fill('#aaaaaa').fontSize(10).text('A NOMBRE DE', 30, 170);
      doc.fill('#ffffff').fontSize(18).text(entrada.nombre_asistente.toUpperCase(), 30, 185);

      // --- TEXTOS Y QR SECCIÓN DERECHA ---
      // Centramos el QR matemáticamente en el espacio blanco
      doc.image(qrBuffer, 465, 30, { width: 120 });

      // Info de control debajo del QR
      doc.fill('#333333').fontSize(9).text('ID ORDEN:', 450, 165, { width: 150, align: 'center' });
      doc.fontSize(16).text(entrada.id_orden.toString(), 450, 180, { width: 150, align: 'center' });

      doc.fill('#888888').fontSize(8).text('Presentá este QR\npara ingresar', 450, 215, { width: 150, align: 'center' });

      doc.end();

    } catch (error) {
      console.error('[TICKET ERROR]', error);
      next(error);
    }
  }
}

module.exports = EntradasVendidasesController;
