class AdminDeleteUser {
  constructor({ usersRepository }) {
    this.$user = usersRepository;
  }

  async execute({ user_id }) {
    // Llamamos al método deleteUser del repositorio
    await this.$user.deleteUser({ user_id });
    return true;
  }
}

module.exports = AdminDeleteUser;