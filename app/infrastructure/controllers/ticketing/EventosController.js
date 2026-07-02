  const { getResponseCustom } = require('../../libs/serviceUtil');

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
        // 🔥 FIX: En los GET la data viaja por URL (req.query), no por req.body
        const result = await this.getEventosList.execute(req.query);

        res.status(200).send(getResponseCustom(200, result));
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
          vender_durante_evento,
          fecha_inicio_venta // <-- NUEVO
        } = req.body;
  
        let imagen_url = null;
        if (req.file) {
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
          vender_durante_evento,
          fecha_inicio_venta // <-- NUEVO
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
        const eventData = { ...req.body }; 
  
        // 1. Manejo de la Imagen (esto ya lo tenías)
        if (req.file) {
          eventData.imagen_url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        } else if (eventData.imagen_url === undefined && evento_id) {
          delete eventData.imagen_url;
        }
  
        // 👇 2. NUEVO: LIMPIEZA DE DATOS (Casteo para MySQL) 👇
        
        // Convertimos fechas vacías a NULL real
        if (eventData.fecha_hora_fin === '' || eventData.fecha_hora_fin === 'null' || !eventData.fecha_hora_fin) {
          eventData.fecha_hora_fin = null;
        }
        if (eventData.fecha_inicio_venta === '' || eventData.fecha_inicio_venta === 'null' || !eventData.fecha_inicio_venta) {
          eventData.fecha_inicio_venta = null;
        }

        // Convertimos el texto del switch a booleano real
        if (eventData.vender_durante_evento === 'true') {
            eventData.vender_durante_evento = true;
        } else if (eventData.vender_durante_evento === 'false') {
            eventData.vender_durante_evento = false;
        }
        
        // 👆 FIN LIMPIEZA 👆
  
        const result = await this.updateEvento.execute({
          evento_id,
          eventDataFromController: eventData,
          newImageFileDetails: req.file 
        });
  
        res.status(200).send(getResponseCustom(200, result));
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
