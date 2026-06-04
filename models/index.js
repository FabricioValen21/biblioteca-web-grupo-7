const sequelize = require("../config/database");

const Usuario = require("./usuario.model");
const Libro = require("./libro.model");
const Prestamo = require("./prestamo.model");

// Relacion: un usuario puede tener muchos prestamos
Usuario.hasMany(Prestamo, {
  foreignKey: "usuario_id",
});

Prestamo.belongsTo(Usuario, {
  foreignKey: "usuario_id",
});

// Relacion: un libro puede aparecer en muchos prestamos
Libro.hasMany(Prestamo, {
  foreignKey: "libro_id",
});

Prestamo.belongsTo(Libro, {
  foreignKey: "libro_id",
});

module.exports = {
  sequelize,
  Usuario,
  Libro,
  Prestamo,
};