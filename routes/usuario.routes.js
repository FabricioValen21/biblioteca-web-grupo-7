// routes/usuario.routes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Importamos los candados de protección del token y del rol de administrador
const verificarToken = require('../middlewares/auth.middleware');
const verificarAdmin = require('../middlewares/rol.middleware');

// Endpoints protegidos (Exigen iniciar sesión con Token y ser Administrador)
router.get('/', verificarToken, verificarAdmin, usuarioController.obtenerUsuarios);
router.get('/:id', verificarToken, verificarAdmin, usuarioController.obtenerUsuarioPorId);
router.put('/:id', verificarToken, verificarAdmin, usuarioController.actualizarUsuario);
router.delete('/:id', verificarToken, verificarAdmin, usuarioController.eliminarUsuario);

module.exports = router;