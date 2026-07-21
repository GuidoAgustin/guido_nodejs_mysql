const nodemailer = require("nodemailer");
class ConfirmarPagoManual {
  // 👇 1. Le pedimos a nuestro Inyector (el equipo de boxes) todas las herramientas
  constructor({
    ordenesRepository,
    entradasVendidasRepository,
    sequelize,
    mailerService,
    qrGenerator,
  }) {
    this.$ordenes = ordenesRepository;
    this.$entradas = entradasVendidasRepository; // Necesitamos buscar las entradas para el mail
    this.sequelize = sequelize; // El Patovica de las transacciones
    this.mailerService = mailerService; // El Cartero
    this.qrGenerator = qrGenerator; // La fábrica de QRs
  }

  async execute({ orden_id, user_id }) {
    // 🌊 TSUNAMI MODE ON: Arrancamos la transacción
    const t = await this.sequelize.transaction();
    let pagoExitoso = false;

    try {
      // 2. Buscamos la orden y la bloqueamos (LOCK.UPDATE) para que nadie más la toque
      const orden = await this.$ordenes.findOne({
        where: {
          id_orden: orden_id,
          id_usuario: user_id,
          estado_pago: "pendiente",
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!orden) {
        await t.rollback(); // Si no existe, abortamos rápido
        return { mensaje: "La orden ya estaba pagada o no existe" };
      }

      // 3. Actualizamos el estado y cobramos
      await orden.update({ estado_pago: "pagado" }, { transaction: t });
      pagoExitoso = true;

      // 4. Soltamos la base de datos a la velocidad de la luz
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error("💥 Error procesando pago manual:", error);
      throw new Error("No se pudo confirmar el pago.");
    }

    // =================================================================
    // 💌 ZONA DE ENVÍO DE CORREOS (¡AFUERA DE LA TRANSACCIÓN!)
    // =================================================================
    if (pagoExitoso) {
      try {
        console.log(
          `🎉 Pago Manual Confirmado. Armando correo para la orden ${orden_id}...`,
        );

        // Necesitamos el mail del usuario. Asumo que podés traerlo desde la orden o lo buscás.
        // Si tu findOne no trae el usuario asociado, ajustá esto según tu modelo:
        // Le decimos a Sequelize que busque al "comprador" (que es el alias real de tu modelo)
        const ordenPagada = await this.$ordenes.findOne({
          where: { id_orden: orden_id },
          include: ["comprador"],
        });
        // Ahora sacamos el mail de "comprador"
        const emailUsuario =
          ordenPagada.comprador?.email || "guido@pruebas.com";

        // Buscamos las entradas generadas para esta orden
        const entradas = await this.$entradas.findByOrdenId(orden_id);

        if (entradas && entradas.length > 0) {
          let qrsHtml = "";
          const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";

          for (const entrada of entradas) {
            const qrBase64 = await this.qrGenerator.generateQRBase64(
              entrada.codigo_unico,
            );
            const downloadLink = `${backendUrl}/entradas_vendidases/ticket/${entrada.codigo_unico}`;

            qrsHtml += `
              <div style="text-align: center; margin-bottom: 30px; padding: 20px; border: 2px dashed #0dcaf0; border-radius: 8px;">
                <h3 style="color: #333;">Entrada #${entrada.codigo_unico
                  .split("-")[0]
                  .toUpperCase()}</h3>
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
              <h2 style="color: #1a2a25; text-align: center;">¡Pago Aprobado en Caja! 🎟️🔥</h2>
              <p style="text-align: center;">Tu compra para la orden <b>#${orden_id}</b> fue procesada con éxito.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              ${qrsHtml}
              <p style="color: #666; font-size: 14px; text-align: center;">Presentá este QR en la puerta o descargá el PDF.</p>
            </div>
          `;

          if (this.mailerService) {
            const mailInfo = await this.mailerService.sendMail({
              from: '"Ticketing App" <no-reply@ticketing.com>',
              to: emailUsuario,
              subject: "¡Tus entradas están listas! 🎟️🔥",
              html: htmlTemplate,
            });
            console.log(`✅ [MAILER] Correo enviado! Link Ethereal: ${nodemailer.getTestMessageUrl(mailInfo)}`);
          }
        }
      } catch (mailError) {
        console.error("⚠️ Error armando el mail manual:", mailError);
      }
    }

    return { mensaje: "Orden pagada con éxito y correo enviado", orden_id };
  }
}

module.exports = ConfirmarPagoManual;
