const response = require("../libs/serviceUtil");
const models = require("../../models");
const validate = require("../libs/validate");

class UsersController {
  constructor({ loginUser, updateUserProfile, getAllUsers }) {
    this.name = "UsersController";
    this.loginUser = loginUser;
    this.updateUserProfile = updateUserProfile;
    this.getAllUsersUseCase = getAllUsers; 
  }

  async login(req, res, next) {
    try {
      const result = await this.loginUser.execute({
        email: req.body.email,
        password: req.body.password,
      });

      res.status(200).send(response.getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const result = await this.updateUserProfile.execute({
        email: req.body.email,
        password: req.body.password,
        new_password: req.body.new_password,
        new_password_confirmation: req.body.new_password_confirmation,
        user: req.user,
      });

      res.status(200).send(response.getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }

  // eslint-disable-next-line consistent-return
  async registro(req, res) {
    try {
      const { first_name, last_name, email, password } = req.body;

      // Validación con validatorjs (solo reglas estándar)
      await validate(
        req.body,
        {
          first_name: "required|min:2",
          last_name: "required|min:2",
          email: "required|email",
          password: "required|min:8",
        },
        {
          "required.first_name": "El nombre es obligatorio",
          "min.first_name": "El nombre debe tener al menos 2 caracteres",
          "required.last_name": "El apellido es obligatorio",
          "min.last_name": "El apellido debe tener al menos 2 caracteres",
          "required.email": "El email es obligatorio",
          "email.email": "El email no es válido",
          "required.password": "La contraseña es obligatoria",
          "min.password": "La contraseña debe tener al menos 8 caracteres",
        }
      );

      // Verificar si el email ya existe
      const exists = await models.user.findOne({ where: { email } });
      if (exists) {
        return res
          .status(400)
          .send(response.getResponseCustom(400, "El email ya está registrado"));
      }

      // Guardar el usuario en la base de datos
      const newUser = await models.user.create({
        first_name,
        last_name,
        email,
        password, // Asegúrate de que el modelo hashee la contraseña
      });

      return res.status(201).send(
        response.getResponseCustom(201, {
          message: "El registro ha sido exitoso.",
          user: {
            user_id: newUser.user_id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
          },
        })
      );
    } catch (error) {
      console.error("Registro error:", error); // <-- Agrega esto para debug

      // Si es un error de validación, enviar el mensaje adecuado
      if (error && (error.messages || error.message)) {
        // Si tiene messages (objeto), extrae los mensajes
        if (error.messages) {
          const mensajes = Object.values(error.messages).flat();
          return res
            .status(400)
            .send(response.getResponseCustom(400, { data: mensajes }));
        }
        // Si tiene message (string), envíalo directo
        if (error.message) {
          return res
            .status(400)
            .send(response.getResponseCustom(400, { data: error.message }));
        }
      }
      // Si es otro error, enviar mensaje genérico
      res
        .status(500)
        .send(
          response.getResponseCustom(500, {
            data: "No se ha podido registrar, intente de nuevo.",
          })
        );
    }
  }

  async getAllUsers(req, res, next) {
    try {
      // CAMBIO 2: Usamos la propiedad con el nuevo nombre
      const result = await this.getAllUsersUseCase.execute(); 
      res.status(200).send(response.getResponseCustom(200, result));
      res.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
