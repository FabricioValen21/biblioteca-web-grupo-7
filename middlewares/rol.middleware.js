// Verifica que el usuario tenga rol admin
const verificarAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({
      mensaje: "Usuario no autenticado",
    });
  }

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({
      mensaje: "Acceso denegado. Solo administrador",
    });
  }

  next();
};

module.exports = verificarAdmin;