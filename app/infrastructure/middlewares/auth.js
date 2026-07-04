const jwt = require('jsonwebtoken');
const CustomError = require('../../domain/exceptions/CustomError');

// 🎟️ PATOVICA GENERAL (Verifica que estés logueado)
const authMiddleware = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) throw new CustomError('No Token found', 403);
    if (!token.startsWith('Bearer ')) throw new CustomError('Token is invalid', 401);

    token = token.slice(7);
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    req.user = decodedUser;
    next();
  } catch (err) {
    next(new CustomError('Token is invalid or has expired', 401));
  }
};

// 👑 PATOVICA VIP (Verifica que seas Administrador Supremo)
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) throw new CustomError('Usuario no autenticado', 401);
    if (req.user.rol !== 'admin') {
      throw new CustomError('Acceso denegado. Se requieren permisos de administrador.', 403);
    }
    next();
  } catch (err) {
    next(err);
  }
};

// 👔 PATOVICA DE STAFF (Deja pasar a Admins y Porteros)
const staffMiddleware = (req, res, next) => {
  try {
    if (!req.user) throw new CustomError('Usuario no autenticado', 401);
    
    // 🔥 Dejamos pasar si es admin O si es portero
    if (req.user.rol !== 'admin' && req.user.rol !== 'portero') {
      throw new CustomError('Acceso denegado. Se requieren permisos de Staff.', 403);
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  staffMiddleware // Exportamos al nuevo guardia
};