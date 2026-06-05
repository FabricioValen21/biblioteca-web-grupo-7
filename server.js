const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.routes");
const libroRoutes = require("./routes/libro.routes");
const prestamoRoutes = require("./routes/prestamo.routes");
// 1. LÍNEA NUEVA: Importamos tus rutas de usuario
const usuarioRoutes = require("./routes/usuario.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/libros", libroRoutes);
app.use("/prestamos", prestamoRoutes);
// 2. LÍNEA NUEVA: Conectamos la ruta base de usuarios para el administrador
app.use("/usuarios", usuarioRoutes);


app.get("/", (req, res) => {
  res.send("API Biblioteca Web Grupo 7 funcionando");
});

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexion a MySQL correcta");
    console.log("Modelos Sequelize cargados correctamente");

    app.listen(PORT, () => {
      console.log("Servidor corriendo en http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con MySQL:", error);
  });