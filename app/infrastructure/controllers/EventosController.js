  const { getResponseCustom } = require('../libs/serviceUtil');

  class EventosController {
    constructor({
      getEventosList,
      showEvento,
      createEvento,
      updateEvento,
      deleteEvento,
    }) {
      this.name = 'eventosController';
      this.getEventosList = getEventosList;
      this.showEvento = showEvento;
      this.createEvento = createEvento;
      this.updateEvento = updateEvento;
      this.deleteEvento = deleteEvento;
    }

    async list(req, res, next) {
      try {
        const result = await this.getEventosList.execute({
        evento_id: req.body.evento_id,
        nombre_evento: req.body.nombre_evento,
        descripcion: req.body.descripcion,
        fecha_hora_inicio: req.body.fecha_hora_inicio,    
        fecha_hora_fin: req.body.fecha_hora_fin,
        lugar_nombre: req.body.lugar_nombre,
        lugar_direccion: req.body.lugar_direccion,
        categoria: req.body.categoria,
        imagen_url: req.body.imagen_url,
        estado_evento: req.body.estado_evento
      });

        res.status(200).send(getResponseCustom(200, result));
        res.end();
      } catch (error) {
        next(error);
      }
    }

    async show(req, res, next) {
      try {
        const { evento_id } = req.params;

        const result = await this.showEvento.execute({
          evento_id,
        });

        res.status(200).send(getResponseCustom(200, result));
        res.end();
      } catch (error) {
        next(error);
      }
    }

    async create(req, res, next) {
      try {
        const {
          nombre_evento,
          descripcion,
          fecha_hora_inicio,
          fecha_hora_fin,
          lugar_nombre,
          lugar_direccion,
          categoria,
          estado_evento,
        } = req.body;
  
        let imagen_url = null;
        if (req.file) {
          // Sirves luego la carpeta 'public/images' como estático:
          //   app.use("/images", express.static("public/images"));
          imagen_url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        }
  
        const result = await this.createEvento.execute({
          nombre_evento,
          descripcion,
          fecha_hora_inicio,
          fecha_hora_fin,
          lugar_nombre,
          lugar_direccion,
          categoria,
          imagen_url,
          estado_evento,
        });
  
        res.status(201).send(getResponseCustom(201, result));
        res.end();
      } catch (error) {
        next(error);
      }
    }

    async update(req, res, next) {
      try {
        const { evento_id } = req.params;
        const { column_1, column_2 } = req.body;

        const result = await this.updateEvento.execute({
          evento_id,
          column_1,
          column_2,
        });

        res.status(200).send(getResponseCustom(200, result));
        res.end();
      } catch (error) {
        next(error);
      }
    }

    async delete(req, res, next) {
      try {
        const { evento_id } = req.params;

        const result = await this.deleteEvento.execute({
          evento_id,
        });

        res.status(200).send(getResponseCustom(200, result));
        res.end();
      } catch (error) {
        next(error);
      }
    }

  }

  module.exports = EventosController;
