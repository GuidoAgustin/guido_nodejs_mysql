// backend/app/routes/index.js
const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const routes = [];


const loadRoutesRecursively = (dir) => {
  // Leemos el contenido del directorio actual
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // 1. Si es una CARPETA, entramos (Recursividad)
    if (stat.isDirectory()) {
      loadRoutesRecursively(fullPath);
    } 
    // 2. Si es un ARCHIVO, verificamos que sea un router válido
    else if (
      file.indexOf('.') !== 0 &&       // Ignorar ocultos (.git, .env)
      file !== basename &&             // Ignorar este mismo index.js
      file.slice(-9) === 'router.js'   // Tiene que terminar en .router.js
    ) {
      const routeGroup = require(fullPath);
      routes.push(routeGroup);
    }
  });
};

// Iniciamos el escaneo desde la carpeta actual
loadRoutesRecursively(__dirname);

module.exports = routes;