require('dotenv').config();
const { Router } = require('express');
// Importar todos los routers;
const {
    URL_API,
    API_KEY
} = process.env;
const temperamentRoutes = require('./tempertament')
const dogsRoutes = require('./dogs.js');
  const dog = require('./dog.js');
const router = Router();
// Configurar los routers
router.use('/temperament', temperamentRoutes);
router.use('/dogs', dogsRoutes);
router.use('/dog', dog);


module.exports = router;





