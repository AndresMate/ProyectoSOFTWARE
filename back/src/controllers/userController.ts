import { Request, Response } from 'express';
import User from '../models/User';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req: Request, res: Response): Promise<void> => {
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
export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioActualizado) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
            return;
        }
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el usuario', error });
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
