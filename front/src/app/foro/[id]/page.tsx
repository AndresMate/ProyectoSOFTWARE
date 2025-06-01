"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Post {
  _id: string;
  titulo: string;
  contenido: string;
  autor: { nombre: string; correo: string };
  comentarios: Comentario[];
  likes: string[];
  fechaCreacion: string;
}

interface Comentario {
  _id: string;
  contenido: string;
  autor: { nombre: string };
  fechaCreacion: string;
}

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchPost = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Respuesta no OK:", data);
        return setError(data.mensaje || "Error al cargar el post");
      }

      setPost(data);
      setError("");
    } catch (err: any) {
      console.error("Error en fetchPost:", err);
      setError("Error al obtener el post");
    }
  };

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Debes iniciar sesión.");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/comentar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido: comentario }),
      });

      if (!res.ok) throw new Error("Error al comentar");

      setComentario("");
      setSuccess("Comentario publicado");
      setError("");
      await fetchPost();
    } catch (err) {
      setError("Error al comentar");
    }
  };

  const handleLike = async () => {
    if (!token) return setError("Debes iniciar sesión.");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/like/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al dar like");

      await fetchPost();
    } catch (err) {
      setError("Error al dar/quitar like");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (!post) return <div className="text-white p-6">Cargando post...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">{post.titulo}</h1>
        <p className="text-sm text-gray-400 mb-4">
          Por {post.autor.nombre} - {new Date(post.fechaCreacion).toLocaleString()}
        </p>
        <p className="mb-4 text-lg">{post.contenido}</p>

        <button
          onClick={handleLike}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 mb-4"
        >
          ❤️ Like ({post.likes.length})
        </button>

        <h2 className="text-xl font-semibold mt-6 mb-2">Comentarios</h2>
        <ul className="space-y-2">
          {post.comentarios.map((comentario) => (
            <li key={comentario._id} className="bg-gray-700 p-2 rounded">
              <p className="text-sm text-gray-300">
                {comentario.autor?.nombre || "Usuario"} -{" "}
                {new Date(comentario.fechaCreacion).toLocaleString()}
              </p>
              <p>{comentario.contenido}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleComentar} className="mt-4">
          <textarea
            className="w-full p-2 bg-gray-700 rounded"
            placeholder="Escribe un comentario..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-2 bg-green-600 px-4 py-2 rounded hover:bg-green-500"
          >
            Comentar
          </button>
        </form>

        {error && <p className="text-red-400 mt-2">{error}</p>}
        {success && <p className="text-green-400 mt-2">{success}</p>}
      </div>
    </div>
  );
};

export default PostDetailPage;
