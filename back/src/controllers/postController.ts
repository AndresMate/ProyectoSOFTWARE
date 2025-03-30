import { Request, Response } from "express";
import Post from "../models/Post";
import Comentario from "../models/Comentario";
import Notification from "../models/Notification";


// Crear un nuevo post
export const crearPost = async (req: Request, res: Response) => {
  try {
    const { titulo, contenido } = req.body;
    const nuevoPost = new Post({ titulo, contenido, autor: req.user.id });
    await nuevoPost.save();
    res.status(201).json(nuevoPost);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el post" });
  }
};

// Obtener todos los posts
export const obtenerPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("autor", "nombre email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los posts" });
  }
};

// Comentar en un post
export const comentarPost = async (req: Request, res: Response) => {
  try {
    const { contenido } = req.body;
    const { postId } = req.params;
    const nuevoComentario = new Comentario({ contenido, autor: req.user.id, post: postId });
    await nuevoComentario.save();

    // Agregar comentario al post
    await Post.findByIdAndUpdate(postId, { $push: { comentarios: nuevoComentario._id } });

    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al comentar el post" });
  }
};

// Editar un post
export const editarPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { titulo, contenido } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ mensaje: "Post no encontrado" });

    // Verificar que el usuario es el autor
    if (post.autor.toString() !== req.user.id)
      return res.status(403).json({ mensaje: "No tienes permisos para editar este post" });

    post.titulo = titulo || post.titulo;
    post.contenido = contenido || post.contenido;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar el post" });
  }
};


// Eliminar un post
export const eliminarPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ mensaje: "Post no encontrado" });

    // Verificar que el usuario es el autor
    if (post.autor.toString() !== req.user.id)
      return res.status(403).json({ mensaje: "No tienes permisos para eliminar este post" });

    await post.deleteOne();
    res.json({ mensaje: "Post eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el post" });
  }
};

// Editar un comentario
export const editarComentario = async (req: Request, res: Response) => {
  try {
    const { comentarioId } = req.params;
    const { contenido } = req.body;

    const comentario = await Comentario.findById(comentarioId);
    if (!comentario) return res.status(404).json({ mensaje: "Comentario no encontrado" });

    // Verificar que el usuario es el autor
    if (comentario.autor.toString() !== req.user.id)
      return res.status(403).json({ mensaje: "No tienes permisos para editar este comentario" });

    comentario.contenido = contenido || comentario.contenido;
    await comentario.save();

    res.json(comentario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar el comentario" });
  }
};

// Eliminar un comentario
export const eliminarComentario = async (req: Request, res: Response) => {
  try {
    const { comentarioId } = req.params;
    const comentario = await Comentario.findById(comentarioId);
    if (!comentario) return res.status(404).json({ mensaje: "Comentario no encontrado" });

    // Verificar que el usuario es el autor
    if (comentario.autor.toString() !== req.user.id)
      return res.status(403).json({ mensaje: "No tienes permisos para eliminar este comentario" });

    await comentario.deleteOne();
    res.json({ mensaje: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el comentario" });
  }
};

// Función para dar o quitar "Me gusta" a un post
export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params; // Obtenemos el ID del post desde la URL
    const usuarioId = req.user.id; // Obtenemos el ID del usuario autenticado

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ mensaje: "Post no encontrado" });

    // Verificar si el usuario ya dio like
    const index = post.likes.indexOf(usuarioId);

    if (index !== -1) {
      // Si el usuario ya dio like, lo quitamos
      post.likes.splice(index, 1);
    } else {
      // Si el usuario no ha dado like, lo agregamos
      post.likes.push(usuarioId);
    }

    await post.save();
    res.json({ mensaje: "Like actualizado", likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al dar/quitar like" });
  }
};

// Obtener posts con paginación
export const obtenerPostsPaginados = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10; // Número de posts por página
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("autor", "nombre email")
      .skip(skip)
      .limit(limit)
      .sort({ fechaCreacion: -1 });

    const total = await Post.countDocuments();
    res.json({
      posts,
      total,
      paginas: Math.ceil(total / limit),
      paginaActual: page,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los posts" });
  }
};
