class GetAllUsers {
  constructor({ usersRepository }) {
    this.$user = usersRepository;
  }

  async execute() {
    return this.$user.getAllUsers();
  }
}

module.exports = GetAllUsers;