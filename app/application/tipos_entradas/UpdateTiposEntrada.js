// backend/app/application/tipos_entradas/UpdateTiposEntrada.js
class UpdateTiposEntrada {
  constructor(tiposEntradasRepository) {
    this.tiposEntradasRepository = tiposEntradasRepository; // Renombrado para consistencia (era $tiposEntradas)
  }

  // El método execute ahora recibirá un solo objeto 'payload' con todos los datos.
  async execute(payloadFromController) {
    console.log('[AppService UpdateTiposEntrada] INICIO - Payload recibido del controlador:', 
      JSON.stringify(payloadFromController, null, 2));

    // El payloadFromController ya contiene tipos_entrada_id y los demás campos.
    // El repositorio está esperando los campos desestructurados.
    const {
      tipos_entrada_id,
      nombre_tipo,
      precio,
      cantidad_total,
      cantidad_disponible,
      descripcion_adicional
    } = payloadFromController;

    // Llamamos al método update del repositorio con los campos desestructurados
    const updatedTipoEntrada = await this.tiposEntradasRepository.update({
      tipos_entrada_id,
      nombre_tipo,
      precio,
      cantidad_total,
      cantidad_disponible,
      descripcion_adicional
    });

    console.log('[AppService UpdateTiposEntrada] FIN - Resultado del repositorio:', 
      JSON.stringify(updatedTipoEntrada, null, 2));
    
    // Devolvemos el objeto del tipo de entrada actualizado
    return updatedTipoEntrada;
  }
}

module.exports = UpdateTiposEntrada;
