// backend/app/infrastructure/middlewares/auth.js
const jwt = require('jsonwebtoken');
const CustomError = require('../../domain/exceptions/CustomError');

// 🎟️ PATOVICA GENERAL (Verifica que estés logueado)
const authMiddleware = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) throw new CustomError('No Token found', 403);

    if (!token.startsWith('Bearer ')) throw new CustomError('Token is invalid', 401);

    token = token.slice(7);

    // 🔥 FIX: Usamos la versión sincrónica que funciona perfecto con try/catch
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Le pasamos el usuario a la request
    req.user = decodedUser;
    next();

  } catch (err) {
    // Si jwt.verify falla (token alterado o expirado), cae acá automáticamente
    next(new CustomError('Token is invalid or has expired', 401));
  }
};

// 👑 PATOVICA VIP (Verifica que seas Administrador)
const adminMiddleware = (req, res, next) => {
  try {
    // Para que este middleware funcione, TIENE que ir después de authMiddleware
    if (!req.user) {
      throw new CustomError('Usuario no autenticado', 401);
    }

    // Comparamos el rol (Ajustá 'admin' si en tu BD se llama distinto, ej: 'ADMIN')
    if (req.user.rol !== 'admin') {
      throw new CustomError('Acceso denegado. Se requieren permisos de administrador.', 403);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware // Exportamos a nuestro nuevo guardia
};