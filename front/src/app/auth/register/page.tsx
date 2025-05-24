"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter(); // 🚀 Agregamos el router para redirigir
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const formData = {
      nombre,
      correo: email,
      password,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "Error en el registro.");
        return;
      }

      setSuccess("Registro exitoso. Redirigiendo a inicio de sesión...");
      setError("");

      // 🔥 Redirigir al usuario después de 2 segundos
      setTimeout(() => {
        router.push("/auth/verify-email"); // Redirige a la página de inicio de sesión
      }, 2000);
    } catch (error) {
        console.error("Error al registrar:", error);
        setError("Error al conectar con el servidor.");
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Correo Electrónico</label>
            <input
              type="email"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div>
            <label className="block text-sm font-medium">Confirmar Contraseña</label>
            <input
              type="password"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
