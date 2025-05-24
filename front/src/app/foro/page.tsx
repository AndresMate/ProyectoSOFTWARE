"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  _id: string;
  titulo: string;
  contenido: string;
  autor: {
    nombre: string;
    correo: string;
  };
  fechaCreacion: string;
}

const ForoPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || "Error al obtener los posts");

      if (Array.isArray(data.posts)) {
        setPosts(data.posts); // Accede a la propiedad 'posts'
      } else {
        throw new Error("La respuesta de la API no contiene un arreglo de posts");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  fetchPosts();
}, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Foro</h1>
        <button
          onClick={() => router.push("/foro/nuevo")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-semibold"
        >
          Nuevo Post
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {posts.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-bold">{post.titulo}</h2>
              <p className="text-gray-300">{post.contenido}</p>
              <p className="text-sm text-gray-500 mt-2">
                Por {post.autor.nombre} - {new Date(post.fechaCreacion).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForoPage;