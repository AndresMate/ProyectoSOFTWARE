"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const VerificarCuenta = ({ params }: { params: { token?: string } }) => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState("Verificando cuenta...");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params?.token) {
      setMensaje("Token no proporcionado");
      setError(true);
      return;
    }

    const verificarCuenta = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verificar/${params.token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.mensaje || "Error desconocido");

        setMensaje("Cuenta verificada exitosamente. Redirigiendo...");
        setTimeout(() => router.push("/auth/login"), 3000);
      } catch (err) {
        setMensaje("Error al verificar la cuenta.");
        setError(true);
        console.error(err);
      }
    };

    verificarCuenta();
  }, [params?.token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold">{mensaje}</h2>
      {error && <p className="text-red-500">Verifica que el enlace sea correcto.</p>}
    </div>
  );
};

export default VerificarCuenta;
