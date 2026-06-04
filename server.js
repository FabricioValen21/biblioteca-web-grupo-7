const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);

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