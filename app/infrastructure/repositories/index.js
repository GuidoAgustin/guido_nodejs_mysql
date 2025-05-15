const models = require('../../models');
const UsersRepository = require('./UserRepository');
const EventosRepository = require('./eventos.repository');

module.exports = {
  usersRepository: new UsersRepository(models),
  EventosRepository,
};
