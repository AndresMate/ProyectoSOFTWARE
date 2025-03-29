import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController";

const router = express.Router();

router.post(
  "/register",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("correo").isEmail().withMessage("Debe ser un correo válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  register as express.RequestHandler // ← Esto soluciona el error TS2769
);

router.post(
  "/login",
  [
    body("correo").isEmail().withMessage("Debe ser un correo válido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  login as express.RequestHandler // ← Esto también soluciona el error TS2769
);

export default router;
