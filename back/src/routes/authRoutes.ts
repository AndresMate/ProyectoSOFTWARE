import express from "express";
import { body } from "express-validator";
import { register, login, verificarCorreo, reenviarVerificacion } from "../controllers/authController";
import {verificarToken} from "../middlewares/authMiddleware";

const router = express.Router();

// Registro de usuario con validaciones
router.post(
  "/register",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Debe ser un correo válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  register as express.RequestHandler // ← Evita error TS2769
);

// Inicio de sesión con validaciones
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Debe ser un correo válido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  login as express.RequestHandler // ← Evita error TS2769
);

// Verificar correo con token
router.get("/verificar/:token", verificarCorreo as express.RequestHandler);

// Reenviar correo de verificación
router.post(
  "/reenviar-verificacion",
  [body("email").isEmail().withMessage("Debe ser un correo válido")],
  reenviarVerificacion as express.RequestHandler
);



export default router;
