"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Post {
  _id: string;
  titulo: string;
  contenido: string;
  autor: { _id: string; nombre: string; correo: string } | null;
  fechaCreacion: string;
}

const EditPostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [usuario, setUsuario] = useState<{ id: string; rol: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      setUsuario({ id: payload.id, rol: payload.rol });
    } catch (err) {
      console.error("Error parsing token:", err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Respuesta no OK:", data);
        setError(data.mensaje || "Error al cargar el post");
        return;
      }

      setPost(data);
      setTitulo(data.titulo);
      setContenido(data.contenido);
      setError("");
    } catch (err: any) {
      console.error("Error en fetchPost:", err);
      setError("Error al obtener el post");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Debes iniciar sesión.");
      return;
    }

    if (!titulo.trim() || !contenido.trim()) {
      setError("El título y contenido son obligatorios.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          contenido: contenido.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || "Error al actualizar el post");
      }

      setSuccess("Post actualizado exitosamente");
      setError("");

      // Redirect to post detail after successful update
      setTimeout(() => {
        router.push(`/foro/${id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Error al actualizar el post");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/foro/${id}`);
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  // Check permissions once post is loaded
  useEffect(() => {
    if (post && usuario) {
      // Only allow editing if user is the author or admin
      if (post.autor && usuario.id !== post.autor._id && usuario.rol !== "admin") {
        setError("No tienes permisos para editar este post");
        setTimeout(() => {
          router.push(`/foro/${id}`);
        }, 2000);
      }
    }
  }, [post, usuario, router, id]);

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Editar Post</h1>
          <button
            onClick={handleCancel}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-700 rounded">
          <p className="text-sm text-gray-400">
            Editando post de{" "}
            {post.autor ? (
              post.autor.nombre
            ) : (
              <span className="text-red-400 italic">Usuario eliminado</span>
            )}{" "}
            - Creado el {new Date(post.fechaCreacion).toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium mb-2">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Escribe el título del post..."
              required
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1">
              {titulo.length}/200 caracteres
            </p>
          </div>

          <div>
            <label htmlFor="contenido" className="block text-sm font-medium mb-2">
              Contenido *
            </label>
            <textarea
              id="contenido"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Escribe el contenido del post..."
              required
              rows={8}
              maxLength={15000}
            />
            <p className="text-xs text-gray-400 mt-1">
              {contenido.length}/15000 caracteres
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving || !titulo.trim() || !contenido.trim()}
              className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 px-6 py-2 rounded hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-900 border border-red-600 rounded">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-900 border border-green-600 rounded">
            <p className="text-green-400">{success}</p>
            <p className="text-sm text-gray-300 mt-1">
              Regresando al post en 1 segundo...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPostPage;