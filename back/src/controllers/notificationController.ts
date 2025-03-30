import { Request, Response } from "express";
import Notification from "../models/Notification";

// Obtener todas las notificaciones del usuario autenticado
export const obtenerNotificaciones = async (req: Request, res: Response) => {
  try {
    const notificaciones = await Notification.find({ usuario: req.user.id }).sort({ fechaCreacion: -1 });
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener notificaciones" });
  }
};

// Marcar una notificación como leída
export const marcarNotificacionComoLeida = async (req: Request, res: Response): Promise<void> => {
  try {
    const notificacion = await Notification.findById(req.params.id);
    if (!notificacion) {
      res.status(404).json({ mensaje: "Notificación no encontrada" });
      return;
    }

    if (notificacion.usuarioDestino.toString() !== req.user.id) {
      res.status(403).json({ mensaje: "No autorizado" });
      return;
    }

    notificacion.leido = true;
    await notificacion.save();
    res.json({ mensaje: "Notificación marcada como leída" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la notificación" });
  }
};

// Eliminar una notificación específica
export const eliminarNotificacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const notificacion = await Notification.findById(req.params.id);
    if (!notificacion) {
      res.status(404).json({ mensaje: "Notificación no encontrada" });
      return;
    }

    if (notificacion.usuarioDestino.toString() !== req.user.id) {
      res.status(403).json({ mensaje: "No autorizado" });
      return;
    }

    await notificacion.deleteOne();
    res.json({ mensaje: "Notificación eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la notificación" });
  }
};
// Eliminar todas las notificaciones del usuario autenticado
export const eliminarTodasLasNotificaciones = async (req: Request, res: Response) => {
  try {
    await Notification.deleteMany({ usuario: req.user.id });
    res.json({ mensaje: "Todas las notificaciones han sido eliminadas" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar todas las notificaciones" });
  }
};
