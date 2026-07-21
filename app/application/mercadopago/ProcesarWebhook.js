// backend/app/application/mercadopago/ProcesarWebhook.js
const nodemailer = require("nodemailer"); // 👈 1. El jefe de correos

class ProcesarWebhook {
  constructor({ 
    ordenesRepository, 
    entradasVendidasRepository, 
    tiposEntradasRepository, 
    sequelize,
    mailerService, 
    qrGenerator    
  }) {
    this.$ordenes = ordenesRepository;
    this.$entradas = entradasVendidasRepository; 
    this.$tipos = tiposEntradasRepository;
    this.sequelize = sequelize; 
    this.mailerService = mailerService;
    this.qrGenerator = qrGenerator;
  }

  async execute(req) {
    const orden_id = req.query.orden_id || req.body.data?.id;
    const estado_mp = req.query.estado || req.body.action || 'aprobado'; 

    if (!orden_id) return true;

    // 🌊 TSUNAMI MODE ON
    const t = await this.sequelize.transaction();
    let pagoExitoso = false; 

    try {
      const orden = await this.$ordenes.findByIdWithItems(orden_id, { 
        transaction: t, 
        lock: t.LOCK.UPDATE 
      });

      if (!orden || orden.estado_pago !== 'pendiente') {
        await t.rollback();
        return true; 
      }

      if (estado_mp === 'aprobado' || estado_mp === 'payment.created') {
        await this.$ordenes.update(
          { ordenes_id: orden_id, datosAActualizar: { estado_pago: 'pagado' } }, 
          t
        );
        pagoExitoso = true; 
      } 
      else if (estado_mp === 'rechazado' || estado_mp === 'cancelado') {
        await this.$ordenes.update({ ordenes_id: orden_id, datosAActualizar: { estado_pago: 'cancelado' } }, t);
        await this.$entradas.updateByOrdenId({ id_orden: orden_id, datosAActualizar: { estado_entrada: 'cancelada' } }, t);

        const stockADevolver = {};
        for (const item of orden.itemsDeOrden) {
          if (!stockADevolver[item.id_tipo_entrada]) stockADevolver[item.id_tipo_entrada] = 0;
          stockADevolver[item.id_tipo_entrada] += 1;
        }
        for (const [id_tipo, cantidad] of Object.entries(stockADevolver)) {
          await this.$tipos.incrementStock(id_tipo, cantidad, t);
        }
      }

      await t.commit(); // 🌊 TSUNAMI MODE OFF: Liberamos la base rapidísimo
    } catch (error) {
      await t.rollback();
      console.error(`💥 Error crítico procesando webhook de orden ${orden_id}:`, error);
    }

    // =================================================================
    // 💌 ZONA DE ENVÍO DE CORREOS (¡AFUERA DE LA TRANSACCIÓN!)
    // =================================================================
    if (pagoExitoso) {
      try {
        console.log(`🎉 Pago confirmado por Webhook. Armando correo para la orden ${orden_id}...`);

        // 👈 2. Arreglamos la búsqueda del "comprador" igual que en el manual
        const ordenPagada = await this.$ordenes.findOne({
          where: { id_orden: orden_id },
          include: ["comprador"],
        });
        const emailUsuario = ordenPagada.comprador?.email;

        const entradas = await this.$entradas.findByOrdenId(orden_id);

        if (entradas && entradas.length > 0) {
          let qrsHtml = '';
          // 👈 3. Apuntamos al Backend para el PDF
          const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

          for (const entrada of entradas) {
            const qrBase64 = await this.qrGenerator.generateQRBase64(entrada.codigo_unico);
            const downloadLink = `${backendUrl}/entradas_vendidases/ticket/${entrada.codigo_unico}`;

            qrsHtml += `
              <div style="text-align: center; margin-bottom: 30px; padding: 20px; border: 2px dashed #0dcaf0; border-radius: 8px;">
                <h3 style="color: #333;">Entrada #${entrada.codigo_unico.split('-')[0].toUpperCase()}</h3>
                <p>A nombre de: <b>${entrada.nombre_asistente}</b></p>
                <img src="${qrBase64}" alt="Código QR" style="width: 200px; height: 200px; margin: 15px 0;" />
                <br>
                <a href="${downloadLink}" style="display: inline-block; padding: 12px 25px; background-color: #0dcaf0; color: #1a2a25; font-weight: bold; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                  📥 Descargar Ticket Oficial en PDF
                </a>
              </div>
            `;
          }

          const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #1a2a25; text-align: center;">¡Pago Aprobado! 🎟️🔥</h2>
              <p style="text-align: center;">Tu compra para la orden <b>#${orden_id}</b> fue procesada con éxito a través de MercadoPago.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              ${qrsHtml}
              <p style="color: #666; font-size: 14px; text-align: center;">Presentá este QR desde tu celular en la puerta o descargá el PDF impreso.</p>
            </div>
          `;

          if (emailUsuario && this.mailerService) {
            const mailInfo = await this.mailerService.sendMail({
              from: process.env.MAIL_FROM || '"Ticketing App" <no-reply@ticketing.com>',
              to: emailUsuario,
              subject: "¡Tus entradas están listas! 🎟️🔥",
              html: htmlTemplate, 
            });
            // 👈 4. El link azul hermoso de Nodemailer
            console.log(`✅ [MAILER WEBHOOK] Correo enviado! Link Ethereal: ${nodemailer.getTestMessageUrl(mailInfo)}`);
          }
        }
      } catch (mailError) {
        console.error("⚠️ No se pudo enviar el correo del webhook, pero el pago SÍ se guardó:", mailError);
      }
    }

    return true; 
  }
}

module.exports = ProcesarWebhook;