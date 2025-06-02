"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Linkedin,
  Github,
  Mail
} from "lucide-react";

export default function Home() {
  const developers = [
    {
      nombre: "Dumar Malpica",
      linkedin: "https://www.linkedin.com/in/dumar-malpica-200213235/",
      github: "https://github.com/JobDumar",
      email: "dumarmalpica66@gmail.com",
    },
    {
      nombre: "Andrés Mateus",
      linkedin: "https://www.linkedin.com/in/andres-felipe-mateus-riaño-a907aa126",
      github: "https://github.com/AndresMate",
      email: "andresfelipemtsr71@gmail.com",
    },
    {
      nombre: "Alejandro Díaz",
      linkedin: "https://www.linkedin.com/in/gustavo-alejandro-d%C3%ADaz-montoya-8381b1335/",
      github: "https://github.com/Alediazzz",
      email: "Gustavo.diaz03@uptc.edu.co",
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col justify-between min-h-screen p-8 text-center bg-gray-900 text-white"
    >
      {/* Contenido principal */}
      <section className="flex flex-col items-center justify-center flex-1">
        <MessageSquare className="w-12 h-12 text-blue-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Bienvenido al Foro UPTC</h1>
        <p className="text-lg text-gray-300 mb-6 max-w-xl">
          Un espacio para compartir conocimientos y debatir temas de ingeniería de sistemas.
        </p>
        <a
          href="/foro"
          aria-label="Ir al foro de publicaciones"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Ver Publicaciones
        </a>
      </section>

      {/* Footer - Desarrolladores */}
      <footer className="mt-16 w-full max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-300">👨‍💻 Desarrolladores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <h3 className="text-white text-lg font-bold mb-2">{dev.nombre}</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-500" />
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Github size={16} className="text-white" />
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-red-400" />
                  <a href={`mailto:${dev.email}`} className="hover:underline">
                    {dev.email}
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </motion.main>
  );
}
