const crypto = require("crypto");
const { Prestamo, Libro, Usuario } = require("../models");

// Solicitar prestamo
const solicitarPrestamo = async (req, res) => {
  try {
    const { libro_id } = req.body;
    const usuario_id = req.usuario.id;

    if (!libro_id) {
      return res.status(400).json({
        mensaje: "Debe enviar el id del libro",
      });
    }

    const libro = await Libro.findByPk(libro_id);

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado",
      });
    }

    if (libro.cantidad <= 0) {
      return res.status(400).json({
        mensaje: "No hay ejemplares disponibles",
      });
    }

    const codigo = crypto.randomBytes(4).toString("hex").toUpperCase();

    const nuevoPrestamo = await Prestamo.create({
      usuario_id: usuario_id,
      libro_id: libro_id,
      codigo: codigo,
      fecha_prestamo: new Date(),
      fecha_devolucion: null,
      estado: "pendiente",
    });

    res.status(201).json({
      mensaje: "Prestamo solicitado correctamente",
      prestamo: nuevoPrestamo,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al solicitar prestamo",
      error: error.message,
    });
  }
};

// Listar prestamos
const listarPrestamos = async (req, res) => {
  try {
    let condicion = {};

    // Si es usuario normal, solo ve sus prestamos
    if (req.usuario.rol === "usuario") {
      condicion.usuario_id = req.usuario.id;
    }

    // Si es admin, ve todos
    const prestamos = await Prestamo.findAll({
      where: condicion,
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "email", "rol"],
        },
        {
          model: Libro,
          attributes: ["id", "titulo", "autor", "categoria", "cantidad"],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json({
      mensaje: "Lista de prestamos",
      prestamos: prestamos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar prestamos",
      error: error.message,
    });
  }
};

// Aprobar prestamo
const aprobarPrestamo = async (req, res) => {
  try {
    const { id } = req.params;

    const prestamo = await Prestamo.findByPk(id);

    if (!prestamo) {
      return res.status(404).json({
        mensaje: "Prestamo no encontrado",
      });
    }

    if (prestamo.estado !== "pendiente") {
      return res.status(400).json({
        mensaje: "Solo se pueden aprobar prestamos pendientes",
      });
    }

    const libro = await Libro.findByPk(prestamo.libro_id);

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado",
      });
    }

    if (libro.cantidad <= 0) {
      return res.status(400).json({
        mensaje: "No hay ejemplares disponibles",
      });
    }

    await libro.update({
      cantidad: libro.cantidad - 1,
    });

    await prestamo.update({
      estado: "prestado",
    });

    res.json({
      mensaje: "Prestamo aprobado correctamente",
      prestamo: prestamo,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al aprobar prestamo",
      error: error.message,
    });
  }
};

// Registrar devolucion
const devolverPrestamo = async (req, res) => {
  try {
    const { id } = req.params;

    const prestamo = await Prestamo.findByPk(id);

    if (!prestamo) {
      return res.status(404).json({
        mensaje: "Prestamo no encontrado",
      });
    }

    if (prestamo.estado !== "prestado") {
      return res.status(400).json({
        mensaje: "Solo se pueden devolver prestamos en estado prestado",
      });
    }

    const libro = await Libro.findByPk(prestamo.libro_id);

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado",
      });
    }

    await libro.update({
      cantidad: libro.cantidad + 1,
    });

    await prestamo.update({
      estado: "devuelto",
      fecha_devolucion: new Date(),
    });

    res.json({
      mensaje: "Devolucion registrada correctamente",
      prestamo: prestamo,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar devolucion",
      error: error.message,
    });
  }
};

module.exports = {
  solicitarPrestamo,
  listarPrestamos,
  aprobarPrestamo,
  devolverPrestamo,
};