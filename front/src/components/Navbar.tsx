import Link from "next/link";

export default function Navbar() {
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
          <li>
            <Link href="/perfil" className="hover:text-gray-400">Perfil</Link>
          </li>
          <li>
            <Link href="/auth" className="hover:text-gray-400">Iniciar sesión</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
