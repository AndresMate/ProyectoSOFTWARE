import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // Asegúrate de que la ruta es correcta
import { AuthProvider } from "../context/AuthContext"; // Importa el AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foro UPTC",
  description: "Foro académico para estudiantes de la UPTC",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider> {/* Envuelve la aplicación con el AuthProvider */}
          <Navbar /> {/* Navbar ahora puede usar el contexto de autenticación */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}