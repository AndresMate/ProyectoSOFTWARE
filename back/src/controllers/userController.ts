import { Request, Response } from 'express';
import User from '../models/User';

// Obtener todos los usuarios
export const obtenerUsuarios = async (_req: Request, res: Response): Promise<void> => {
    try {
        const usuarios = await User.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios', error });
    }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
            return;
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el usuario', error });
    }
};

// Crear un nuevo usuario
export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const nuevoUsuario = new User(req.body);
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el usuario', error });
    }
};

// Actualizar un usuario
// Agregar esta función a tu userController.ts

export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        // El middleware `verificarToken` ya agregó `req.usuario`
        const usuarioId = req.user?.id;

        if (!usuarioId) {
            res.status(401).json({ mensaje: "Usuario no autorizado" });
            return;
        }

        const { nombre, correo } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!nombre || !correo) {
            res.status(400).json({ mensaje: "Nombre y correo son requeridos" });
            return;
        }

        // Filtrar los campos que se pueden actualizar
        const camposActualizables: any = {};
        if (nombre) camposActualizables.nombre = nombre;
        if (correo) camposActualizables.correo = correo;

        const usuarioActualizado = await User.findByIdAndUpdate(
            usuarioId,
            camposActualizables,
            { new: true }
        ).select('-password'); // No devolver la contraseña

        if (!usuarioActualizado) {
            console.log(`Usuario no encontrado con ID: ${usuarioId}`);
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
            return;
        }

        res.json(usuarioActualizado);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(400).json({ mensaje: 'Error al actualizar el perfil', error });
    }
};
// Eliminar un usuario
export const eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
            return;
        }
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
    }
};

export const obtenerPerfil = async (req: Request, res: Response): Promise<void> => {
    try {
        // El middleware `verificarToken` ya agregó `req.usuario`
        const usuarioId = req.user?.id;

        if (!usuarioId) {
            res.status(401).json({ mensaje: "Usuario no autorizado" });
            return;
        }

        // Buscar al usuario en la base de datos
        const usuario = await User.findById(usuarioId).select('-password');

        if (!usuario) {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
            return;
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el perfil", error });
    }
};