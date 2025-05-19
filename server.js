// backend/server.js

require('dotenv').config(); // Required for environment variables
require('./app/infrastructure/libs/utils');

// add CustomError to globals
global.CustomError = require('./app/domain/exceptions/CustomError');

const helmet      = require('helmet');
const express     = require('express');
const compression = require('compression');
const path        = require('path');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');

const { cors }         = require('./app/infrastructure/middlewares/cors');
const { errorHandler } = require('./app/infrastructure/libs/errorHandler');

const app = express();

// --- Middlewares globales ---
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(cors);

// Servir estáticos de las imágenes de eventos subidas por Multer
// Cualquier fichero en public/images estará accesible en /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'public/images')));

// Montar rutas
const routes = require('./app/routes/index');

routes.forEach(r => app.use(r.basePath, r.router));

// Servir cualquier otro asset en /public
app.use(express.static('public'));

// Main errorHandler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

// 404
app.use((req, res) => {
  res.status(404).json({
    code:    404,
    message: 'Not found',
    success: false,
    data:    [],
  });
});

// Levantar servidor
const server = app.listen(process.env.PORT || 3000, () => {
  const host = server.address().address;
  const { port } = server.address();
  console.log(`App listening at ${host}:${port}`);
});
