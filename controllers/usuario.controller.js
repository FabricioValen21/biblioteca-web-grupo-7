// controllers/usuario.controller.js
const { Usuario } = require('../models');

// GET /usuarios -> Obtener todos los usuarios (Solo para el Admin)
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'rol', 'createdAt'] // Protegemos el password
        });
        res.json({ mensaje: "Lista de usuarios obtenida con éxito", usuarios });
    } catch (error) {
        res.status(500).json({ error: "Error interno al obtener los usuarios" });
    }
};

// GET /usuarios/:id -> Obtener un solo usuario por su ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: ['id', 'nombre', 'email', 'rol', 'createdAt']
        });
        
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario encontrado", usuario });
    } catch (error) {
        res.status(500).json({ error: "Error al buscar el usuario" });
    }
};

// PUT /usuarios/:id -> Modificar datos o cambiar el Rol de un usuario
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol } = req.body;
        
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Si viene un dato nuevo lo cambia, si no, deja el anterior
        usuario.nombre = nombre || usuario.nombre;
        usuario.email = email || usuario.email;
        usuario.rol = rol || usuario.rol;
        
        await usuario.save();
        res.json({ mensaje: "Usuario actualizado correctamente", usuario });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
};

// DELETE /usuarios/:id -> Eliminar una cuenta de usuario del sistema
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        
        await usuario.destroy();
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
};