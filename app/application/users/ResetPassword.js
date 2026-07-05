const CustomError = require("../../domain/exceptions/CustomError");
const jwt = require("jsonwebtoken");

class ResetPassword {
  constructor({ usersRepository, validator }) {
    this.$user = usersRepository;
    this.validator = validator;
  }

  async execute({ token, password, password_confirmation }) {
    await this.validate({ password, password_confirmation });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      throw new CustomError("El enlace expiró o es inválido. Por favor, solicitá uno nuevo.", 401);
    }

    const userId = decoded.user_id;
    const user = await this.$user.getUserById({ user_id: userId });

    if (!user) {
      throw new CustomError("Usuario no encontrado.", 404);
    }

    // Le mandamos la password CRUDA (Ej: "12345678"). 
    // Tu Repositorio/Modelo se encargan de encriptarla solos.
    await this.$user.updateUser({
      user_id: userId,
      password: password, 
    });

    return { message: "Contraseña actualizada exitosamente. Ya podés iniciar sesión." };
  }

  validate({ password, password_confirmation }) {
    return this.validator(
      { password, password_confirmation },
      { password: "required|confirmed|min:8" },
      {
        "required.password": "La contraseña es obligatoria.",
        "confirmed.password": "Las contraseñas no coinciden.",
        "min.password": "La contraseña debe tener al menos 8 caracteres.",
      }
    );
  }
}

module.exports = ResetPassword;