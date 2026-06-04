const { Op } = require("sequelize");
const { Libro } = require("../models");

// Listar libros y buscar por titulo
const listarLibros = async (req, res) => {
  try {
    const { titulo } = req.query;

    let condicion = {};

    // Si llega titulo por query, se hace busqueda
    if (titulo) {
      condicion = {
        titulo: {
          [Op.like]: `%${titulo}%`,
        },
      };
    }

    const libros = await Libro.findAll({
      where: condicion,
      order: [["id", "ASC"]],
    });

    res.json({
      mensaje: "Lista de libros",
      libros: libros,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar libros",
      error: error.message,
    });
  }
};

// Obtener libro por id
const obtenerLibro = async (req, res) => {
  try {
    const { id } = req.params;

    const libro = await Libro.findByPk(id);

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado",
      });
    }

    res.json({
      mensaje: "Libro encontrado",
      libro: libro,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener libro",
      error: error.message,
    });
  }
};

// Crear libro
const crearLibro = async (req, res) => {
  try {
    const { titulo, autor, categoria, cantidad } = req.body;

    if (!titulo || !autor || !categoria || cantidad === undefined) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    if (cantidad < 0) {
      return res.status(400).json({
        mensaje: "La cantidad no puede ser negativa",
      });
    }

    const nuevoLibro = await Libro.create({
      titulo: titulo,
      autor: autor,
      categoria: categoria,
      cantidad: cantidad,
    });

    res.status(201).json({
      mensaje: "Libro creado correctamente",
      libro: nuevoLibro,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear libro",
      error: error.message,
    });
  }
};

// Actualizar libro
const actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, categoria, cantidad } = req.body;

    const libro = await Libro.findByPk(id);

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado",
      });
    }

    if (cantidad !== undefined && cantidad < 0) {
      return res.status(400).json({
        mensaje: "La cantidad no puede ser negativa",
      });
    }

    await libro.update({
      titulo: titulo || libro.titulo,
      autor: autor || libro.autor,
      categoria: categoria || libro.categoria,
      cantidad: cantidad !== undefined ? cantidad : libro.cantidad,
    });

    res.json({
      mensaje: "Libro actualizado correctamente",
      libro: libro,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar libro",
      error: error.message,
    });
  }
};

// Eliminar libro
const eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;

    const libro = await Libro.findByPk(id);

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado",
      });
    }

    await libro.destroy();

    res.json({
      mensaje: "Libro eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar libro",
      error: error.message,
    });
  }
};

module.exports = {
  listarLibros,
  obtenerLibro,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
};