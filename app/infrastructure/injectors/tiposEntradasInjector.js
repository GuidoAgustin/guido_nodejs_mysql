const { TiposEntradasRepository } = require('../repositories');
const {
  GetTiposEntradasList,
  ShowTiposEntrada,
  CreateTiposEntrada,
  UpdateTiposEntrada,
  DeleteTiposEntrada,
} = require('../../application/tipos_entradas');
const TiposEntradasController = require('../controllers/TiposEntradasController');

module.exports = function registerController({ models }) {
  const tiposEntradasRepository = new TiposEntradasRepository(models);

  const getTiposEntradasList = new GetTiposEntradasList(tiposEntradasRepository);
  const createTiposEntrada = new CreateTiposEntrada(tiposEntradasRepository);
  const showTiposEntrada = new ShowTiposEntrada(tiposEntradasRepository);
  const updateTiposEntrada = new UpdateTiposEntrada(tiposEntradasRepository);
  const deleteTiposEntrada = new DeleteTiposEntrada(tiposEntradasRepository);

  return new TiposEntradasController({
    getTiposEntradasList,
    createTiposEntrada,
    showTiposEntrada,
    updateTiposEntrada,
    deleteTiposEntrada,
  });
};
