"use client";
import { useState, useEffect } from "react";

interface User {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
}

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token disponible");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudo obtener el perfil del usuario");
        }

        const data: User = await res.json();
        setUser(data);
        setNombre(data.nombre);
        setCorreo(data.correo);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token disponible");

      if (!nombre.trim() || !correo.trim()) {
        throw new Error("El nombre y el correo no pueden estar vacíos");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        throw new Error("El formato del correo no es válido");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, correo }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mensaje || "Error al actualizar el perfil");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) {
    return (
      <div className="text-center">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>
      {user && (
        <div className="mt-4 text-lg text-gray-600">
          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full p-2 bg-gray-200 rounded border border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Correo:</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full p-2 bg-gray-200 rounded border border-gray-400"
                />
              </div>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <p>
                <strong>Nombre:</strong> {user.nombre}
              </p>
              <p>
                <strong>Correo:</strong> {user.correo}
              </p>
              <p>
                <strong>Rol:</strong> {user.rol}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Editar Información
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}