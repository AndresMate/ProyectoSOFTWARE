"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Post {
  _id: string;
  titulo: string;
  contenido: string;
  autor: { _id: string; nombre: string; correo: string } | null;
  comentarios: Comentario[];
  likes: string[];
  fechaCreacion: string;
}

interface Comentario {
  _id: string;
  contenido: string;
  autor: { nombre: string } | null;
  fechaCreacion: string;
}

const PostDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [usuario, setUsuario] = useState<{ id: string; rol: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      setUsuario({ id: payload.id, rol: payload.rol });
    } catch (err) {
      console.error("Error parsing token:", err);
      localStorage.removeItem("token"); // Remove invalid token
    }
  }, []);

  // Función para renderizar contenido con código
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3);
        const lines = codeContent.split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');

        return (
          <div key={index} className="my-4">
            {language && (
              <div className="bg-gray-700 px-3 py-1 text-xs text-gray-300 rounded-t border-l-4 border-blue-500">
                {language}
              </div>
            )}
            <pre className="bg-gray-800 p-4 rounded-b overflow-x-auto border-l-4 border-blue-500">
              <code className="text-sm text-green-400 font-mono whitespace-pre">
                {code || codeContent}
              </code>
            </pre>
          </div>
        );
      } else {
        return (
          <div key={index} className="whitespace-pre-wrap">
            {part}
          </div>
        );
      }
    });
  };

  const fetchPost = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este post?")) return;
    if (!token) return setError("Debes iniciar sesión.");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || "Error al eliminar el post");
      }

      router.push("/foro");
    } catch (err: any) {
      setError(err.message || "Error al eliminar el post");
    }
  };

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Debes iniciar sesión.");
    if (!comentario.trim()) return setError("El comentario no puede estar vacío.");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/comentar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido: comentario.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || "Error al comentar");
      }

      setComentario("");
      setSuccess("Comentario publicado");
      setError("");
      await fetchPost();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Error al comentar");
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || "Error al dar like");
      }

      await fetchPost();
    } catch (err: any) {
      setError(err.message || "Error al dar/quitar like");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Post no encontrado</p>
          <button
            onClick={() => router.push("/foro")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            Volver al foro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">{post.titulo}</h1>
        <p className="text-sm text-gray-400 mb-4">
          Por{" "}
          {post.autor ? (
            post.autor.nombre
          ) : (
            <span className="text-red-400 italic">Usuario eliminado</span>
          )}{" "}
          - {new Date(post.fechaCreacion).toLocaleString()}
        </p>

        {/* Aquí cambié el renderizado del contenido */}
        <div className="mb-4 text-lg">
          {renderContent(post.contenido)}
        </div>

        <button
          onClick={handleLike}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 mb-4 transition-colors"
        >
          ❤️ Like ({post.likes.length})
        </button>

        {usuario && (
          <div className="flex gap-2 mb-4">
            {post.autor && usuario.id === post.autor._id && (
              <button
                onClick={() => router.push(`/foro/editar/${post._id}`)}
                className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-500 transition-colors"
              >
                Editar
              </button>
            )}
            {((post.autor && usuario.id === post.autor._id) || usuario.rol === "admin") && (
              <button
                onClick={handleEliminar}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>
        )}

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Comentarios ({post.comentarios.length})
        </h2>

        {post.comentarios.length === 0 ? (
          <p className="text-gray-400 mb-4">No hay comentarios aún. ¡Sé el primero en comentar!</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {post.comentarios.map((comentario) => (
              <li key={comentario._id} className="bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-300 mb-1">
                  {comentario.autor ? (
                    comentario.autor.nombre
                  ) : (
                    <span className="text-red-400 italic">Usuario eliminado</span>
                  )}{" "}
                  - {new Date(comentario.fechaCreacion).toLocaleString()}
                </p>
                {/* También renderizamos código en los comentarios */}
                <div>{renderContent(comentario.contenido)}</div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleComentar} className="mt-4">
          <textarea
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
            placeholder="Escribe un comentario...&#10;&#10;Para código usa:&#10;```javascript&#10;tu código aquí&#10;```"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition-colors"
            disabled={!comentario.trim()}
          >
            Comentar
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-900 border border-red-600 rounded">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-900 border border-green-600 rounded">
            <p className="text-green-400">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;