class GetAllUsers {
  constructor({ usersRepository }) {
    this.$user = usersRepository;
  }

  async execute({ filters, pagination } = {}) {
    const result = await this.$user.getAllUsers({ filters, pagination });
    return result; // ← Ya devuelve { users, total }
  }
}

module.exports = GetAllUsers;