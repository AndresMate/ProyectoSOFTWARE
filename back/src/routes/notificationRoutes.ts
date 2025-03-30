import express from "express";
import { verificarToken } from "../middlewares/authMiddleware";
import {   obtenerNotificaciones,   marcarNotificacionComoLeida,   eliminarNotificacion,   eliminarTodasLasNotificaciones } from "../controllers/notificationController";

const router = express.Router();

// Obtener todas las notificaciones del usuario autenticado
router.get("/", verificarToken, obtenerNotificaciones);

// Marcar una notificación como leída
router.put("/:id/leer", verificarToken, marcarNotificacionComoLeida);

// Eliminar una notificación específica
router.delete("/:id", verificarToken, eliminarNotificacion);

// Eliminar todas las notificaciones del usuario
router.delete("/", verificarToken, eliminarTodasLasNotificaciones);

export default router;
