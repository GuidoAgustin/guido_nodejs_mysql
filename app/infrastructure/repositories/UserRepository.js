const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const CustomError = require('../../domain/exceptions/CustomError');

class UsersRepository {
  constructor(models) {
    this.models = models;
  }

  async getUserByEmail({ email, transaction }) {
    const user = await this.models.user.findOne({
      transaction,
      where: {
        email,
      },
    });
    if (!user) throw new CustomError('User not found', 404);

    return user;
  }

  async getUserById({ user_id, transaction }) {
    const user = await this.models.user.findOne({
      transaction,
      where: {
        user_id,
      },
    });
    if (!user) throw new CustomError('User not found', 404);

    return user;
  }

  async updateUser({ user_id, password }) {
    await this.models.user.update({
      password: bcrypt.hashSync(password, 10),
    }, {
      where: {
        user_id,
      },
    });
  }

  checkPassword({ password, user_password }) {
    return bcrypt.compareSync(password, user_password);
  }

  async getAllUsers({ filters, pagination } = {}) {
  const where = {};

  // --- Filtros de búsqueda (Sin cambios) ---
  if (filters) {
    if (filters.ids && Array.isArray(filters.ids) && filters.ids.length) {
      where.user_id = { [Op.in]: filters.ids };
    }

    if (filters.search && typeof filters.search === 'string') {
      const term = `%${filters.search}%`;
      where[Op.or] = [
        { first_name: { [Op.like]: term } },
        { last_name: { [Op.like]: term } },
        { email: { [Op.like]: term } },
      ];
    }
  }

  // --- 👇 LÓGICA DE ORDENAMIENTO ---
  let order = [['user_id', 'ASC']]; // Default

  if (filters && filters.sort_by) {
    // Sequelize necesita el formato: [['columna', 'ASC/DESC']]
    const direction = filters.sort_dir ? filters.sort_dir.toUpperCase() : 'ASC';
    
    // Validación de seguridad básica para evitar inyección SQL en el nombre de columna
    // Aseguramos que solo ordenen por columnas que existen en tu modelo
    const validColumns = ['first_name', 'last_name', 'email', 'role', 'user_id'];
    
    if (validColumns.includes(filters.sort_by)) {
       order = [[filters.sort_by, direction]];
    }
  }

  const options = {
    where,
    // eslint-disable-next-line object-shorthand
    order: order, // 👈 Usamos la variable dinámica
  };

  if (pagination && pagination.per_page) {
    const perPage = Number(pagination.per_page) || 10;
    const page = Number(pagination.page) > 0 ? Number(pagination.page) : 1;
    options.limit = perPage;
    options.offset = (page - 1) * perPage;
  }

  const total = await this.models.user.count({ where });
  const users = await this.models.user.scope('noPassword').findAll(options);

  return { users, total };
}
}

module.exports = UsersRepository;
