class AdminUpdateUser {
  constructor({ usersRepository, validator }) {
    this.$user = usersRepository; // Usamos $user como en tu otro archivo
    this.validator = validator;
  }

  async execute({ user_id, data }) {
    // 1. Validamos los datos recibidos
    await this.validate(data);

    // 2. Llamamos al método updateUserData del repositorio
    const userUpdated = await this.$user.updateUserData({ 
      user_id, 
      data 
    });

    return userUpdated;
  }

  validate(data) {
    // Reglas de validación para los datos que edita el admin
    return this.validator(
      data,
      {
        first_name: "required|min:2",
        last_name: "required|min:2",
        email: "required|email",
        rol: "required" // Descomenta si también validas el rol
      },
      {
        "required.first_name": "El nombre es obligatorio",
        "min.first_name": "El nombre debe tener al menos 2 caracteres",
        "required.last_name": "El apellido es obligatorio",
        "required.email": "El email es obligatorio",
        "email.email": "El formato del email no es válido",
      }
    );
  }
}

module.exports = AdminUpdateUser;