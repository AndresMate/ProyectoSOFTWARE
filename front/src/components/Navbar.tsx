"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      router.push("/"); // Redirige al inicio
    } else {
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