const { EventosRepository } = require('../repositories');
const {
  GetEventosList,
  ShowEvento,
  CreateEvento,
  UpdateEvento,
  DeleteEvento,
} = require('../../application/eventos');
const EventosController = require('../controllers/EventosController');

module.exports = function registerController({ models }) {
  const eventosRepository = new EventosRepository(models);

  const getEventosList = new GetEventosList(eventosRepository);
  const createEvento = new CreateEvento(eventosRepository);
  const showEvento = new ShowEvento(eventosRepository);
  const updateEvento = new UpdateEvento(eventosRepository);
  const deleteEvento = new DeleteEvento(eventosRepository);

  return new EventosController({
    getEventosList,
    createEvento,
    showEvento,
    updateEvento,
    deleteEvento,
  });
};
