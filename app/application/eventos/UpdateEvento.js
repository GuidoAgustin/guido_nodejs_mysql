// backend/app/application/eventos/UpdateEvento.js
const fs = require("fs");
const path = require("path");
const CustomError = require("../../domain/exceptions/CustomError");

class UpdateEvento {
  constructor(eventosRepository) {
    this.eventosRepository = eventosRepository;
  }

  async execute({ evento_id, eventDataFromController, newImageFileDetails }) {
    // eventDataFromController ya debería tener la nueva imagen_url si se subió una nueva imagen.
    // newImageFileDetails es opcional, solo si necesitas info del archivo aquí (ej. para borrar la antigua).

    const eventoExistente = await this.eventosRepository.show({ evento_id }); // Usamos show para verificar si existe
    if (!eventoExistente) {
      throw new CustomError("Evento no encontrado para actualizar", 404);
    }

    const updatePayload = { ...eventDataFromController };

    // Lógica para eliminar imagen antigua si se sube una nueva
    if (newImageFileDetails && eventoExistente.imagen_url) {
      // Evitar borrar placeholders o URLs externas si no están en tu servidor
      if (
        eventoExistente.imagen_url.startsWith("/") ||
        eventoExistente.imagen_url.startsWith(process.env.APP_URL)
      ) {
        // Ajusta esta condición
        const oldImageFileName = path.basename(eventoExistente.imagen_url);
        // Asume que las imágenes están en 'public/images' relativo a la raíz del proyecto
        const oldImagePath = path.join(
          process.cwd(),
          "public/images",
          oldImageFileName
        );

        if (
          oldImageFileName &&
          oldImageFileName !== newImageFileDetails.filename
        ) {
          // No borrar si es la misma imagen (poco probable)
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.warn(
                `WARN: No se pudo eliminar la imagen antigua ${oldImagePath}: ${err.message}`
              );
              // No fallar la actualización por esto, solo registrar.
            } else {
              console.log(`INFO: Imagen antigua eliminada ${oldImagePath}`);
            }
          });
        }
      }
    }

    // Asegurar que campos numéricos y de fecha se manejen correctamente si vienen de FormData
    // (El controller debería idealmente pre-procesarlos)
    // Ejemplo:
    // if (updatePayload.fecha_hora_inicio) updatePayload.fecha_hora_inicio = new Date(updatePayload.fecha_hora_inicio);
    // if (updatePayload.fecha_hora_fin) updatePayload.fecha_hora_fin = updatePayload.fecha_hora_fin ? 
    // new Date(updatePayload.fecha_hora_fin) : null;

    return this.eventosRepository.update({
      evento_id,
      updateData: updatePayload,
    });
  }
}

module.exports = UpdateEvento;
