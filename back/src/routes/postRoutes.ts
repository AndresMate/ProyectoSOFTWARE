import express from "express";
import { crearPost, obtenerPosts, comentarPost, likePost, editarPost, eliminarPost, eliminarComentario, obtenerPostsPaginados, editarComentario } from "../controllers/postController";
import { verificarToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", verificarToken, crearPost); // Crear post (protegida)
router.get("/all", obtenerPosts); // Obtener todos los posts
router.post("/:postId/comentar", verificarToken, comentarPost); // Comentar un post (protegida)
router.post("/like/:id", verificarToken, likePost as express.RequestHandler); // Dar o quitar like a un post (protegida)
router.put("/:postId", verificarToken, editarPost as express.RequestHandler); // Editar post
router.delete("/:postId", verificarToken, eliminarPost as express.RequestHandler); // Eliminar post
router.put("/:comentarioId/comentario", verificarToken, editarComentario as express.RequestHandler); // Editar comentario
router.delete("/:comentarioId/comentario", verificarToken, eliminarComentario as express.RequestHandler); // Eliminar comentario
router.get("/", obtenerPostsPaginados); // Obtener posts paginados

export default router;