const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

// Registrar usuario
const registrar = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar campos vacios
    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    // Verificar si el correo ya existe
    const usuarioExiste = await Usuario.findOne({
      where: { email: email },
    });

    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: "El correo ya esta registrado",
      });
    }

    // Cifrar password
    const passwordCifrado = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre: nombre,
      email: email,
      password: passwordCifrado,
      rol: "usuario",
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message,
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos vacios
    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y password son obligatorios",
      });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({
      where: { email: email },
    });

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    // Comparar password
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Password incorrecto",
      });
    }

    // Crear token
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      mensaje: "Login correcto",
      token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesion",
      error: error.message,
    });
  }
};

module.exports = {
  registrar,
  login,
};