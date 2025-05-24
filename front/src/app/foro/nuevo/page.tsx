"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NuevoPostPage = () => {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, contenido }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "Error al crear post");
      }

      setMensaje("Post creado exitosamente");
      setTimeout(() => {
        router.push("/foro");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Crear nuevo post</h1>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {mensaje && <p className="text-green-500 text-sm mb-2">{mensaje}</p>}

        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 mb-3 bg-gray-700 rounded border border-gray-600"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Contenido"
          className="w-full p-2 h-32 mb-3 bg-gray-700 rounded border border-gray-600"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold"
        >
          Publicar
        </button>
      </form>
    </div>
  );
};

export default NuevoPostPage;
