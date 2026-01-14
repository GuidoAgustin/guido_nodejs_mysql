const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const CustomError = require('../../domain/exceptions/CustomError');

class UsersRepository {
  constructor(models) {
    this.models = models;
  }

  // --- MÉTODOS EXISTENTES ---

  async getUserByEmail({ email, transaction }) {
    const user = await this.models.user.findOne({
      transaction,
      where: { email },
    });
    if (!user) throw new CustomError('User not found', 404);
    return user;
  }

  async getUserById({ user_id, transaction }) {
    const user = await this.models.user.findOne({
      transaction,
      where: { user_id },
    });
    if (!user) throw new CustomError('User not found', 404);
    return user;
  }

  // Este actualiza SOLO password (lo tenías de antes)
  async updateUser({ user_id, password }) {
    await this.models.user.update({
      password: bcrypt.hashSync(password, 10),
    }, {
      where: { user_id },
    });
  }

  // Síncrono porque usa compareSync (CPU bound)
  checkPassword({ password, user_password }) {
    return bcrypt.compareSync(password, user_password);
  }

  async getAllUsers({ filters, pagination } = {}) {
    const where = {};

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

    let order = [['user_id', 'ASC']];

    if (filters && filters.sort_by) {
      const direction = filters.sort_dir ? filters.sort_dir.toUpperCase() : 'ASC';
      const validColumns = ['first_name', 'last_name', 'email', 'role', 'user_id'];
      
      if (validColumns.includes(filters.sort_by)) {
         order = [[filters.sort_by, direction]];
      }
    }

    const options = {
      where,
      // eslint-disable-next-line object-shorthand
      order: order,
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

  async updateUserData({ user_id, data }) {
    // Extraemos solo lo que permitimos editar para evitar inyecciones de campos raros
    const { first_name, last_name, email, rol } = data;
    
    // Ejecutamos el update
    const [updatedRows] = await this.models.user.update({
      first_name,
      last_name,
      email,
      rol // Asegúrate de que tu modelo tenga la columna 'role' o 'rol'
    }, {
      where: { user_id }
    });

    if (updatedRows === 0) {
        // Opcional: Si no se actualizó nada, podría ser que el ID no exista
        // o que los datos sean idénticos.
    }

    // Devolvemos el usuario actualizado recargándolo de la BD
    return this.getUserById({ user_id });
  }

  /**
   * Elimina un usuario físicamente de la base de datos
   */
  async deleteUser({ user_id }) {
    const deleted = await this.models.user.destroy({
      where: { user_id }
    });
    
    if (!deleted) throw new CustomError('User not found or already deleted', 404);
    
    return true;
  }

} // <--- CIERRE DE LA CLASE

module.exports = UsersRepository;