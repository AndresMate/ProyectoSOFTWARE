import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Verificar variables de entorno requeridas
if (!process.env.JWT_SECRET || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.CLIENT_URL) {
  console.error("Error: Variables de entorno requeridas no están definidas");
  process.exit(1);
}

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Interfaz para el payload del token JWT
interface JwtPayload {
  id: string;
  rol?: string;
}

// Registro de usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    console.log("Datos recibidos:", { nombre, correo });
    console.log("Estado de conexión DB:", mongoose.connection.readyState);

    // Verificar si el usuario ya existe - utilizando consulta directa
    console.log("Buscando usuario con correo:", correo);

    // Primero intentamos con la consulta normal de Mongoose
    const usuarioExistente = await User.findOne({ correo });
    console.log("Resultado de búsqueda con Mongoose:", usuarioExistente);

    // Verificamos si la conexión está establecida antes de acceder a db
    if (mongoose.connection.readyState !== 1) {
      console.log("Database not connected");
      return res.status(500).json({ mensaje: "Error de conexión a la base de datos" });
    }

    // Ahora podemos acceder de forma segura a db
    const coleccionUsuarios = mongoose.connection.db!.collection('users');
    const resultadoDirecto = await coleccionUsuarios.findOne({ correo });
    console.log("Resultado de búsqueda directa:", resultadoDirecto);

    // También buscamos con el campo 'email' por si acaso
    const resultadoEmail = await coleccionUsuarios.findOne({ email: correo });
    console.log("Resultado búsqueda por 'email':", resultadoEmail);

    if (usuarioExistente || resultadoDirecto || resultadoEmail) {
      console.log("Usuario existente encontrado, rechazando registro");
      return res.status(400).json({
        mensaje: "El correo ya está registrado.",
        detalles: "Contacta al administrador si crees que es un error."
      });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const usuario = new User({
      nombre,
      correo,
      password: hashedPassword,
      rol: rol || "usuario",
      verificado: false,
    });

    console.log("Usuario a guardar:", {
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    });

    // Guardar usuario en la base de datos
    const usuarioGuardado = await usuario.save();
    console.log("Usuario guardado con ID:", usuarioGuardado._id);

    // Generar token de verificación
    const token = jwt.sign({ id: usuarioGuardado._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Enviar correo de verificación
    try {
      const url = `${process.env.CLIENT_URL}/api/auth/verificar/${token}`;
      await transporter.sendMail({
        to: usuario.correo,
        subject: "Verifica tu cuenta",
        html: `<h3>Haz clic en el siguiente enlace para verificar tu cuenta:</h3>
               <a href="${url}">${url}</a>`,
      });
      console.log("Correo de verificación enviado a:", usuario.correo);
    } catch (emailError) {
      console.error("Error al enviar correo:", emailError);
      // No eliminamos el usuario, solo notificamos que el correo no se pudo enviar
    }

    res.status(201).json({
      mensaje: "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
      usuarioId: usuarioGuardado._id
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ mensaje: "Error en el registro", error });
  }
};

// Verificar cuenta
export const verificarCorreo = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ mensaje: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log("Token decodificado:", decoded);

    const usuario = await User.findById(decoded.id);
    console.log("Usuario encontrado para verificación:", usuario ? usuario._id : "No encontrado");

    if (!usuario) {
      return res.status(400).json({ mensaje: "Token inválido o usuario no encontrado" });
    }

    if (usuario.verificado) {
      console.log("Usuario ya verificado previamente");
      return res.status(200).json({ mensaje: "La cuenta ya ha sido verificada previamente" });
    }

    usuario.verificado = true;
    await usuario.save();
    console.log("Usuario verificado exitosamente");

    res.json({ mensaje: "Cuenta verificada correctamente" });
  } catch (error) {
    console.error("Error al verificar la cuenta:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ mensaje: "Token inválido o expirado" });
    }
    res.status(500).json({ mensaje: "Error al verificar la cuenta" });
  }
};

// Reenviar correo de verificación
export const reenviarVerificacion = async (req: Request, res: Response) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ mensaje: "Correo electrónico requerido" });
    }

    console.log("Reenvío de verificación solicitado para:", correo);
    const usuario = await User.findOne({ correo });

    if (!usuario) {
      console.log("Usuario no encontrado para reenvío");
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (usuario.verificado) {
      console.log("El usuario ya está verificado, no es necesario reenviar");
      return res.status(400).json({ mensaje: "El usuario ya está verificado" });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const url = `${process.env.CLIENT_URL}/verificar/${token}`;

    try {
      await transporter.sendMail({
        to: usuario.correo,
        subject: "Verifica tu cuenta",
        html: `<h3>Haz clic en el siguiente enlace para verificar tu cuenta:</h3>
               <a href="${url}">${url}</a>`,
      });
      console.log("Correo de verificación reenviado a:", usuario.correo);
      res.json({ mensaje: "Correo de verificación reenviado" });
    } catch (emailError) {
      console.error("Error al enviar correo:", emailError);
      return res.status(500).json({ mensaje: "Error al enviar el correo de verificación" });
    }
  } catch (error) {
    console.error("Error al reenviar el correo:", error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud" });
  }
};

// Inicio de sesión
export const login = async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
    }

    console.log("Intento de login para:", correo);
    const usuario = await User.findOne({ correo });

    if (!usuario) {
      console.log("Usuario no encontrado en login");
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    if (!usuario.verificado) {
      console.log("Usuario no verificado intentando login");
      return res.status(403).json({
        mensaje: "Debes verificar tu cuenta primero",
        requiereVerificacion: true,
        correo: usuario.correo
      });
    }

    const esValido = await bcrypt.compare(password, usuario.password);

    if (!esValido) {
      console.log("Contraseña incorrecta para usuario:", correo);
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    console.log("Login exitoso para usuario:", correo);
    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// Recuperación de contraseña - Solicitar reseteo
export const solicitarResetPassword = async (req: Request, res: Response) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ mensaje: "Correo electrónico requerido" });
    }

    const usuario = await User.findOne({ correo });
    if (!usuario) {
      // Por seguridad, no informamos si el correo existe o no
      return res.status(200).json({
        mensaje: "Si el correo existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña"
      });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h", // Token con menor duración para reset de contraseña
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`; //remplazar la ruta cuando se tenga el endpoint

    await transporter.sendMail({
      to: usuario.correo,
      subject: "Restablecimiento de Contraseña",
      html: `
        <h3>Has solicitado restablecer tu contraseña</h3>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      `,
    });

    res.status(200).json({
      mensaje: "Si el correo existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña"
    });
  } catch (error) {
    console.error("Error al solicitar reset de contraseña:", error);
    res.status(500).json({ mensaje: "Error al procesar la solicitud" });
  }
};

// Resetear contraseña
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        mensaje: "Token y nueva contraseña son requeridos"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const usuario = await User.findById(decoded.id);

    if (!usuario) {
      return res.status(400).json({ mensaje: "Token inválido o expirado" });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar la contraseña
    usuario.password = hashedPassword;
    await usuario.save();

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al resetear contraseña:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ mensaje: "Token inválido o expirado" });
    }
    res.status(500).json({ mensaje: "Error al procesar la solicitud" });
  }
};