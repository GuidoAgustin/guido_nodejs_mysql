const bcrypt = require('bcrypt');
const { Op, Sequelize } = require('sequelize'); 

const CustomError = require('../../domain/exceptions/CustomError');

class UsersRepository {
  constructor(models) {
    this.models = models;
  }

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

  async updateUser({ user_id, password }) {
    await this.models.user.update({
      password: password, // 🔥 ACÁ ESTABA EL BUG. Le sacamos el bcrypt para que pase limpia.
    }, {
      where: { user_id },
      individualHooks: true // Le avisa a Sequelize que dispare la encriptación del modelo
    });
  }

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
      const validColumns = ['first_name', 'last_name', 'email', 'rol', 'user_id', 'totalSpent'];
      
      if (validColumns.includes(filters.sort_by)) {
         if (filters.sort_by === 'totalSpent') {
            order = [[Sequelize.literal('totalSpent'), direction]];
         } else {
            order = [[filters.sort_by, direction]];
         }
      }
    }

    const options = {
      where,
      order: order,
      attributes: {
        include: [
          [
            // 👇 ACÁ ESTÁ LA CORRECCIÓN EXACTA CON LOS NOMBRES DE TUS MODELOS
            Sequelize.literal(`(
              SELECT COALESCE(SUM(monto_total), 0)
              FROM orden
              WHERE orden.id_usuario = user.user_id
                AND orden.estado_pago = 'pagado'
            )`),
            'totalSpent'
          ]
        ]
      }
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
    const { first_name, last_name, email, rol } = data;
    
    const [updatedRows] = await this.models.user.update({
      first_name,
      last_name,
      email,
      rol
    }, {
      where: { user_id }
    });

    return this.getUserById({ user_id });
  }

  async deleteUser({ user_id }) {
    const deleted = await this.models.user.destroy({
      where: { user_id }
    });
    
    if (!deleted) throw new CustomError('User not found or already deleted', 404);
    
    return true;
  }

}

module.exports = UsersRepository;