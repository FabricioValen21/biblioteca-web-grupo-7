const express = require("express");
const router = express.Router();

const libroController = require("../controllers/libro.controller");
const verificarToken = require("../middlewares/auth.middleware");
const verificarAdmin = require("../middlewares/rol.middleware");

// Todos pueden ver libros
router.get("/", libroController.listarLibros);

// Todos pueden ver un libro especifico
router.get("/:id", libroController.obtenerLibro);

// Solo admin puede crear libros
router.post("/", verificarToken, verificarAdmin, libroController.crearLibro);

// Solo admin puede actualizar libros
router.put("/:id", verificarToken, verificarAdmin, libroController.actualizarLibro);

// Solo admin puede eliminar libros
router.delete("/:id", verificarToken, verificarAdmin, libroController.eliminarLibro);

module.exports = router;