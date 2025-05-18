 module.exports = {
  up: async (queryInterface) => {
    // 1. Usuarios
    await queryInterface.bulkInsert('user', [
      {
        user_id: 20,
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'juan@example.com',
        password: '$2b$10$6/r5pBOx0p.o.v15Zx1pQO8oywNYidxSw9oVhiMUap8xmGsfEHoP2', // 123456
        rol: 'usuario',
      },
      {
        user_id: 21,
        first_name: 'Ana',
        last_name: 'López',
        email: 'ana@example.com',
        password: '$2b$10$6/r5pBOx0p.o.v15Zx1pQO8oywNYidxSw9oVhiMUap8xmGsfEHoP2',
        rol: 'usuario',
      },
      {
        user_id: 22,
        first_name: 'Carlos',
        last_name: 'Ruiz',
        email: 'carlos@example.com',
        password: '$2b$10$6/r5pBOx0p.o.v15Zx1pQO8oywNYidxSw9oVhiMUap8xmGsfEHoP2',
        rol: 'admin',
      },
    ]);

    // 2. Eventos
    await queryInterface.bulkInsert('evento', [
      {
        evento_id: 20,
        nombre_evento: 'Festival de Música',
        descripcion: 'Un evento para los amantes de la música.',
        fecha_hora_inicio: new Date(),
        fecha_hora_fin: new Date(),
        lugar_nombre: 'Parque Central',
        lugar_direccion: 'Calle 123',
        categoria: 'Concierto',
        imagen_url: 'https://placehold.co/600x400',
        estado_evento: 'disponible',
        fecha_creacion: new Date(),
      },
      {
        evento_id: 21,
        nombre_evento: 'Conferencia Tech',
        descripcion: 'Evento de tecnología e innovación.',
        fecha_hora_inicio: new Date(),
        fecha_hora_fin: new Date(),
        lugar_nombre: 'Centro de Convenciones',
        lugar_direccion: 'Avenida Tech 456',
        categoria: 'Tecnología',
        imagen_url: 'https://placehold.co/600x400',
        estado_evento: 'proximamente',
        fecha_creacion: new Date(),
      },
      {
        evento_id: 22,
        nombre_evento: 'Obra de Teatro',
        descripcion: 'Una obra para toda la familia.',
        fecha_hora_inicio: new Date(),
        fecha_hora_fin: new Date(),
        lugar_nombre: 'Teatro Municipal',
        lugar_direccion: 'Calle Arte 789',
        categoria: 'Teatro',
        imagen_url: 'https://placehold.co/600x400',
        estado_evento: 'agotado',
        fecha_creacion: new Date(),
      },
    ]);

    // 3. Tipos de entrada (3 por cada evento: General + 2 variantes)
    await queryInterface.bulkInsert('tipos_entrada', [
      // Evento 20
      {
        id_tipo_entrada: 20,
        id_evento: 20,
        nombre_tipo: 'General',
        precio: 1500.00,
        cantidad_total: 100,
        cantidad_disponible: 80,
        descripcion_adicional: 'Entrada general sin numerar',
      },
      {
        id_tipo_entrada: 21,
        id_evento: 20,
        nombre_tipo: 'VIP',
        precio: 3000.00,
        cantidad_total: 50,
        cantidad_disponible: 50,
        descripcion_adicional: 'Asientos preferenciales',
      },
      {
        id_tipo_entrada: 22,
        id_evento: 20,
        nombre_tipo: 'Meet & Greet',
        precio: 5000.00,
        cantidad_total: 20,
        cantidad_disponible: 20,
        descripcion_adicional: 'Acceso al backstage',
      },

      // Evento 21
      {
        id_tipo_entrada: 23,
        id_evento: 21,
        nombre_tipo: 'General',
        precio: 1500.00,
        cantidad_total: 100,
        cantidad_disponible: 100,
        descripcion_adicional: 'Entrada general sin numerar',
      },
      {
        id_tipo_entrada: 24,
        id_evento: 21,
        nombre_tipo: 'Premium',
        precio: 3500.00,
        cantidad_total: 60,
        cantidad_disponible: 60,
        descripcion_adicional: 'Asientos cercanos al escenario',
      },
      {
        id_tipo_entrada: 25,
        id_evento: 21,
        nombre_tipo: 'VIP',
        precio: 5000.00,
        cantidad_total: 30,
        cantidad_disponible: 30,
        descripcion_adicional: 'Sala VIP y coffee break',
      },

      // Evento 22
      {
        id_tipo_entrada: 26,
        id_evento: 22,
        nombre_tipo: 'General',
        precio: 1500.00,
        cantidad_total: 80,
        cantidad_disponible: 80,
        descripcion_adicional: 'Entrada general sin numerar',
      },
      {
        id_tipo_entrada: 27,
        id_evento: 22,
        nombre_tipo: 'Platea Baja',
        precio: 2000.00,
        cantidad_total: 70,
        cantidad_disponible: 20,
        descripcion_adicional: 'Vista preferencial en platea baja',
      },
      {
        id_tipo_entrada: 28,
        id_evento: 22,
        nombre_tipo: 'Platea Alta',
        precio: 2500.00,
        cantidad_total: 50,
        cantidad_disponible: 50,
        descripcion_adicional: 'Asientos en platea alta',
      },
    ]);

    // 4. Órdenes
    await queryInterface.bulkInsert('orden', [
      {
        id_orden: 20,
        id_usuario: 20,
        fecha_orden: new Date(),
        monto_total: 1500.00,
        estado_pago: 'pagado',
        id_transaccion_pago: 'TXN123456',
        metodo_pago: 'tarjeta',
      },
      {
        id_orden: 21,
        id_usuario: 21,
        fecha_orden: new Date(),
        monto_total: 3500.00,
        estado_pago: 'pendiente',
        id_transaccion_pago: null,
        metodo_pago: 'mercado_pago',
      },
      {
        id_orden: 22,
        id_usuario: 22,
        fecha_orden: new Date(),
        monto_total: 2000.00,
        estado_pago: 'reembolsado',
        id_transaccion_pago: 'TXN987654',
        metodo_pago: 'efectivo',
      },
    ]);

    // 5. Entradas vendidas
    await queryInterface.bulkInsert('entradas_vendidas', [
      {
        id_entrada_vendida: 20,
        id_orden: 20,
        id_tipo_entrada: 20,
        codigo_unico: 'ENTRADA-001',
        estado_entrada: 'valida',
        precio_pagado: 1500.00,
        nombre_asistente: 'Juan Pérez',
        email_asistente: 'juan@example.com',
      },
      {
        id_entrada_vendida: 21,
        id_orden: 21,
        id_tipo_entrada: 24,
        codigo_unico: 'ENTRADA-002',
        estado_entrada: 'cancelada',
        precio_pagado: 3500.00,
        nombre_asistente: 'Ana López',
        email_asistente: 'ana@example.com',
      },
      {
        id_entrada_vendida: 22,
        id_orden: 22,
        id_tipo_entrada: 27,
        codigo_unico: 'ENTRADA-003',
        estado_entrada: 'utilizada',
        precio_pagado: 2000.00,
        nombre_asistente: 'Carlos Ruiz',
        email_asistente: 'carlos@example.com',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('entradas_vendidas', { id_entrada_vendida: { [Sequelize.Op.gte]: 20 } });
    await queryInterface.bulkDelete('orden',             { id_orden:            { [Sequelize.Op.gte]: 20 } });
    await queryInterface.bulkDelete('tipos_entrada',    { id_tipo_entrada:     { [Sequelize.Op.gte]: 20 } });
    await queryInterface.bulkDelete('evento',           { evento_id:           { [Sequelize.Op.gte]: 20 } });
    await queryInterface.bulkDelete('user',             { user_id:             { [Sequelize.Op.gte]: 20 } });
  }
};
