// backend/app/application/Ticketing/eventos/UpdateEvento.js
const fs = require("fs");
const path = require("path");
const CustomError = require("../../../domain/exceptions/CustomError");

class UpdateEvento {
  constructor(eventosRepository) {
    this.eventosRepository = eventosRepository;
  }

  async execute({ evento_id, eventDataFromController, newImageFileDetails }) {
    const eventoExistente = await this.eventosRepository.show({ evento_id });
    if (!eventoExistente) {
      throw new CustomError("Evento no encontrado para actualizar", 404);
    }

    const updatePayload = { ...eventDataFromController };

    // 1. PRIMERO ACTUALIZAMOS LA BASE DE DATOS 💾
    // (Si esto falla, el código explota acá y la imagen vieja se salva)
    const eventoActualizado = await this.eventosRepository.update({
      evento_id,
      updateData: updatePayload,
    });

    // 2. LUEGO BORRAMOS LA BASURA VIEJA 🗑️
    if (newImageFileDetails && eventoExistente.imagen_url) {
      if (
        eventoExistente.imagen_url.startsWith("/") ||
        eventoExistente.imagen_url.startsWith(process.env.APP_URL || 'http')
      ) {
        const oldImageFileName = path.basename(eventoExistente.imagen_url);
        const oldImagePath = path.join(
          process.cwd(),
          "public/images",
          oldImageFileName
        );

        if (oldImageFileName && oldImageFileName !== newImageFileDetails.filename) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.warn(`WARN: No se pudo eliminar la imagen antigua ${oldImagePath}: ${err.message}`);
            } else {
              console.log(`INFO: Imagen antigua eliminada ${oldImagePath}`);
            }
          });
        }
      }
    }

    return eventoActualizado;
  }
}

module.exports = UpdateEvento;