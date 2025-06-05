// backend/app/infrastructure/injectors/index.js
const models = require('../../models');

const { sequelize } = models; // Extraer la instancia de sequelize

// Importar los módulos de los inyectores/controladores específicos
// Para UsersInjector, volvemos a como lo tenías si esa era la forma correcta:
const { usersController } = require('./UsersInjector'); 
// Si UsersInjector.js en realidad exporta una función, entonces sería:
// const usersController = require('./UsersInjector')({ models /*, sequelize si lo necesita */ });

const eventosInjector = require('./eventosInjector');
const tiposEntradasInjector = require('./tiposEntradasInjector');
const ordenesesInjector = require('./ordenesesInjector'); // Este es el que necesita 'sequelize'
const entradasVendidasesInjector = require('./entradasVendidasesInjector');

// Instanciamos los controladores que se obtienen llamando a sus funciones inyectoras
const eventosController = eventosInjector({ models });
const tiposEntradasController = tiposEntradasInjector({ models });
const entradasVendidasesController = entradasVendidasesInjector({ models });

// Para ordenesesInjector, le pasamos 'models' Y 'sequelize'
// El nombre de la variable aquí (ordenesCtrlInstance) es local a este archivo.
const ordenesCtrlInstance = ordenesesInjector({ models, sequelize }); 

module.exports = {
  usersController, // Se exporta el usersController obtenido arriba
  eventosController,
  tiposEntradasController,
  ordenesesController: ordenesCtrlInstance, // <<<< Aquí usamos la instancia y el nombre que espera tu router
  entradasVendidasesController,
};