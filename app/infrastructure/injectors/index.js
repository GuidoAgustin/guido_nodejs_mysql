const { usersController } = require('./UsersInjector.js');
const {eventosInjector} = require('./eventosInjector');
const {tiposEntradasInjector} = require('./tiposEntradasInjector');
const {ordenesesInjector} = require('./ordenesesInjector');
const {entradasVendidasesInjector} = require('./entradasVendidasesInjector');

module.exports = {
  usersController,
  eventosInjector,
  tiposEntradasInjector,
  ordenesesInjector,
  entradasVendidasesInjector,
};