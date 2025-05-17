const models = require('../../models');

const { usersController } = require('./UsersInjector');
const eventosInjector = require('./eventosInjector');
const tiposEntradasInjector = require('./tiposEntradasInjector');
const ordenesesInjector = require('./ordenesesInjector');
const entradasVendidasesInjector = require('./entradasVendidasesInjector');

// Instanciamos cada controller pasando los modelos
const eventosController = eventosInjector({ models });
const tiposEntradasController = tiposEntradasInjector({ models });
const ordenesesController = ordenesesInjector({ models });
const entradasVendidasesController = entradasVendidasesInjector({ models });

module.exports = {
  usersController,
  eventosController,
  tiposEntradasController,
  ordenesesController,
  entradasVendidasesController,
};
