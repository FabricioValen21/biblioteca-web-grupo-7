const express = require("express");
const router = express.Router();

const prestamoController = require("../controllers/prestamo.controller");
const verificarToken = require("../middlewares/auth.middleware");
const verificarAdmin = require("../middlewares/rol.middleware");

// Usuario autenticado solicita prestamo
router.post("/", verificarToken, prestamoController.solicitarPrestamo);

// Admin ve todos, usuario ve sus propios prestamos
router.get("/", verificarToken, prestamoController.listarPrestamos);

// Solo admin aprueba prestamos
router.put("/:id/aprobar", verificarToken, verificarAdmin, prestamoController.aprobarPrestamo);

// Solo admin registra devoluciones
router.put("/:id/devolver", verificarToken, verificarAdmin, prestamoController.devolverPrestamo);

module.exports = router;