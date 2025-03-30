export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenido al Foro UPTC</h1>
      <p className="text-lg text-gray-600 mb-6">
        Un espacio para compartir conocimientos y debatir temas de ingeniería de sistemas.
      </p>
      <a
        href="/posts"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
      >
        Ver Publicaciones
      </a>
    </main>
  );
}
