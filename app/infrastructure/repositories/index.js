const models = require('../../models');
const UsersRepository = require('./UserRepository');
const EventosRepository = require('./eventos.repository');
const TiposEntradasRepository = require('./tipos_entradas.repository');
const OrdenesesRepository = require('./ordeneses.repository');

module.exports = {
  usersRepository: new UsersRepository(models),
  EventosRepository,
  TiposEntradasRepository,
  OrdenesesRepository,
};
