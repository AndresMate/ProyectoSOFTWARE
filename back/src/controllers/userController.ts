import { Request, Response } from "express";
import User from "../models/User";

/**
 * Obtener el perfil del usuario autenticado
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id; // El ID del usuario autenticado
        const user = await User.findById(userId).select("-password"); // Excluye la contraseña

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * Actualizar el perfil del usuario autenticado
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id; // El ID del usuario autenticado
        const { nombre, correo } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { nombre, correo },
            { new: true, runValidators: true }
        ).select("-password"); // Excluye la contraseña

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};