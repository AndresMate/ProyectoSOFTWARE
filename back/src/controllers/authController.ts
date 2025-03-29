import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    const { nombre, correo, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombre, correo, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el registro" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
    }

    const usuario = await User.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
