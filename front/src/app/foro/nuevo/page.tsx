"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NuevoPostPage = () => {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [usuario, setUsuario] = useState<{ nombre: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsuario({ nombre: payload.nombre || "Usuario" });
    } catch (err) {
      console.error("Error parsing token:", err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);

    if (!titulo.trim() || !contenido.trim()) {
      setError("El título y contenido son obligatorios.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          contenido: contenido.trim()
        }),
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
      setError(err.message || "Error al crear el post");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/foro");
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Crear Nuevo Post</h1>
          <button
            onClick={handleCancel}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Editor</h2>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-500 transition-colors"
              >
                {showPreview ? "Editor" : "Vista Previa"}
              </button>
            </div>

            <div className={`${showPreview ? "hidden lg:block" : ""}`}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    placeholder="Escribe un título llamativo..."
                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none transition-colors"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
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
                    placeholder="Escribe tu post aquí...&#10;&#10;Para código usa:&#10;```javascript&#10;tu código aquí&#10;```"
                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                    rows={12}
                    maxLength={15000}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {contenido.length}/15000 caracteres
                  </p>
                </div>

                <div className="bg-gray-700 p-3 rounded text-sm text-gray-300">
                  <p className="font-medium mb-2">💡 Consejos para escribir:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Para código: <code className="bg-gray-600 px-1 rounded">```lenguaje</code></li>
                    <li>• Ejemplo: <code className="bg-gray-600 px-1 rounded">```javascript</code></li>
                    <li>• Usa líneas vacías para separar párrafos</li>
                    <li>• Sé claro y descriptivo en tu título</li>
                  </ul>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || !titulo.trim() || !contenido.trim()}
                    className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex-1"
                  >
                    {loading ? "Publicando..." : "Publicar Post"}
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
            </div>
          </div>

          {/* Preview Section */}
          <div className={`bg-gray-800 p-6 rounded-lg ${showPreview ? "" : "hidden lg:block"}`}>
            <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>

            <div className="bg-gray-700 p-4 rounded-lg min-h-[400px]">
              {titulo || contenido ? (
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {titulo || "Tu título aquí..."}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Por {usuario.nombre} - {new Date().toLocaleString()}
                  </p>
                  <div className="text-gray-200">
                    {contenido ? (
                      renderContent(contenido)
                    ) : (
                      <p className="text-gray-400 italic">Tu contenido aparecerá aquí...</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 pt-20">
                  <div className="text-4xl mb-4">📝</div>
                  <p>Tu post aparecerá aquí</p>
                  <p className="text-sm mt-2">Comienza escribiendo tu título y contenido</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-900 border border-red-600 rounded">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {mensaje && (
          <div className="mt-6 p-4 bg-green-900 border border-green-600 rounded">
            <p className="text-green-400">{mensaje}</p>
            <p className="text-sm text-gray-300 mt-1">
              Redirigiendo al foro...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NuevoPostPage;