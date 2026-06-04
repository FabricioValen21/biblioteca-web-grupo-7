const jwt = require("jsonwebtoken");

// Verifica si el usuario envio un token valido
const verificarToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        mensaje: "No se envio token",
      });
    }

    // Formato esperado: Bearer TOKEN
    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        mensaje: "Token no valido",
      });
    }

    const datos = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario en req
    req.usuario = datos;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token invalido o expirado",
      error: error.message,
    });
  }
};

module.exports = verificarToken;