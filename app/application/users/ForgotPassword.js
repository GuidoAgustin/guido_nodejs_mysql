const CustomError = require("../../domain/exceptions/CustomError");
const { mail, mailParse } = require("../../infrastructure/libs/mailer");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
class ForgotPassword {
  constructor({ usersRepository, validator }) {
    this.$user = usersRepository;
    this.validator = validator;
  }

  async execute({ email }) {
    // 1. Validamos que nos manden un email válido
    await this.validate({ email });

    // 2. Buscamos al usuario en la base de datos
    const user = await this.$user.getUserByEmail({ email });
    if (!user) {
      // Si no existe, tiramos error 404
      throw new CustomError(
        "No existe un usuario registrado con este correo",
        404,
      );
    }

    // 3. Generamos el "Token Mágico" (JWT)
    // Guardamos el ID del usuario adentro y le ponemos una vida útil de 15 minutos
    const userId = user.user_id || user.id;
    const resetToken = jwt.sign(
      { user_id: userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }, // Expira en 15 minutos por seguridad
    );

    // 4. Armamos el Link de Recuperación que apunta a tu Frontend
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:9091";
    const resetLink = `${frontendUrl}/reset_password?token=${resetToken}`;

    // 5. Armamos la plantilla HTML del correo
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #1a2a25;">¡Hola, {{name}}!</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña en nuestro sistema de Tickets.</p>
        <p>Hacé clic en el siguiente botón para crear una nueva contraseña. <b>Este enlace es válido por 15 minutos.</b></p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{link}}" style="padding: 12px 25px; background-color: #0dcaf0; color: #1a2a25; font-weight: bold; text-decoration: none; border-radius: 5px;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Si no fuiste vos quien solicitó esto, simplemente ignorá este correo. Tu cuenta está segura.</p>
      </div>
    `;

    // Inyectamos las variables en la plantilla usando tu función mailParse
    const htmlToSend = mailParse(htmlTemplate, {
      name: user.first_name,
      link: resetLink,
    });

    // 6. ¡Disparamos el correo con Nodemailer!
    const mailInfo = await mail.sendMail({
      from:
        process.env.MAIL_FROM || '"Soporte Tickets" <no-reply@ticketing.com>',
      to: user.email,
      subject: "Restablecer tu Contraseña 🔐",
      html: htmlToSend,
    });

    // Imprimimos info útil en la consola para facilitarte el desarrollo
    console.log("✅ [MAILER] Correo enviado de prueba a Ethereal.");
    console.log(
      "🔗 Ver correo renderizado acá: ",
      nodemailer.getTestMessageUrl(mailInfo),
    ); // Link directo en consola

    return {
      message:
        "Te enviamos un correo con las instrucciones para restablecer tu contraseña.",
    };
  }

  validate({ email }) {
    return this.validator(
      { email },
      { email: "required|email" },
      {
        "required.email": "Por favor ingresá tu correo electrónico.",
        "email.email": "El formato del correo no es válido.",
      },
    );
  }
}

module.exports = ForgotPassword;
