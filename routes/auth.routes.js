const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// Ruta para registrar usuario
router.post("/register", authController.registrar);

// Ruta para iniciar sesion
router.post("/login", authController.login);

module.exports = router;