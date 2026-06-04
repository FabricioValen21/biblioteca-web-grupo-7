const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("API Biblioteca Web Grupo 7 funcionando");
});

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexion a MySQL correcta");

    app.listen(PORT, () => {
      console.log("Servidor corriendo en http://localhost:" + PORT);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con MySQL:", error);
  });