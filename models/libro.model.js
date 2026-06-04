const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Libro = sequelize.define("Libro", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },

  autor: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  categoria: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },

  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: "libros",
});

module.exports = Libro;