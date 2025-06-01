import express from "express";
import {
  crearPost,
  obtenerPosts,
  comentarPost,
  likePost,
  editarPost,
  eliminarPost,
  eliminarComentario,
  obtenerPostsPaginados,
  editarComentario,
  obtenerPostPorId
} from "../controllers/postController";
import { verificarToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Crear un nuevo post
router.post("/", verificarToken, crearPost);

// Obtener todos los posts (sin paginación) → solo si la necesitas además de la paginación
router.get("/all", obtenerPosts);

// Obtener posts paginados
router.get("/", obtenerPostsPaginados);

// Comentar un post
router.post("/:postId/comentar", verificarToken, comentarPost);

// Dar o quitar like
router.post("/like/:id", verificarToken, likePost as express.RequestHandler);

// Editar post
router.put("/:postId", verificarToken, editarPost as express.RequestHandler);

// Obtener un post por ID
router.get("/:postId", obtenerPostPorId as express.RequestHandler); // en postRoutes

// Eliminar post
router.delete("/:postId", verificarToken, eliminarPost as express.RequestHandler);

// Editar comentario
router.put("/:comentarioId/comentario", verificarToken, editarComentario as express.RequestHandler);

// Eliminar comentario
router.delete("/:comentarioId/comentario", verificarToken, eliminarComentario as express.RequestHandler);

export default router;