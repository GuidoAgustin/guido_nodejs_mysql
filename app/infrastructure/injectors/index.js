const { usersController } = require('./UsersInjector.js');
const eventosInjector = require('./eventosInjector');
const tiposEntradasInjector = require('./tiposEntradasInjector');
const ordenesesInjector = require('./ordenesesInjector');

module.exports = {
  usersController,
  eventosInjector,
  tiposEntradasInjector,
  ordenesesInjector,
};