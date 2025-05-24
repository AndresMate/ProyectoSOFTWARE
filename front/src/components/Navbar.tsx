"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica si hay un token en localStorage al cargar el componente
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Escucha cambios en localStorage
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsAuthenticated(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // Cerrar sesión
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      router.push("/"); // Redirige al inicio
    } else {
      // Redirige a la página de autenticación
      router.push("/auth");
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Foro UPTC</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-gray-400">Inicio</Link>
          </li>
          <li>
            <Link href="/foro" className="hover:text-gray-400">Foro</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link href="/perfil" className="hover:text-gray-400">Perfil</Link>
            </li>
          )}
          <li>
            <button
              onClick={handleAuthAction}
              className="hover:text-gray-400"
            >
              {isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}