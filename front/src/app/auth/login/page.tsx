"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Importa el contexto

const Login = () => {
  const router = useRouter();
  const { login } = useAuth(); // Usa el método login del contexto
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "Error en el inicio de sesión");
      }

      // Usa el método login del contexto para actualizar el estado global
      login(data.token);

      // Redirige a la página principal o dashboard
      router.push("/foro");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Correo Electrónico</label>
            <input
              type="email"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">¿No tienes una cuenta?</p>
          <button
            onClick={() => router.push("/auth/register")}
            className="text-blue-500 hover:underline"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;