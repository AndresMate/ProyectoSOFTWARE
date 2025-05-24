"use client";

import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Iniciar Sesión / Registrarse</h1>
      <p className="mt-4 text-lg text-gray-400">Accede a tu cuenta o crea una nueva.</p>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => router.push("/auth/register")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
        >
          Registrarse
        </button>
      </div>
    </main>
  );
}