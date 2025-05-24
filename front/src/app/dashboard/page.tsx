"use client";
import { useEffect, useState } from "react";

interface User {
    nombre: string;
    correo: string;
    rol: string;
}

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const obtenerPerfil = async () => {
            try {
                const token = localStorage.getItem("token"); // Obtener token del localStorage
                if (!token) throw new Error("No hay token disponible");

                const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/perfil`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!respuesta.ok) {
                    throw new Error("No se pudo obtener el perfil");
                }

                const data: User = await respuesta.json();
                setUser(data);
            } catch (error) {
                setError((error as Error).message);
            }
        };

        obtenerPerfil();
    }, []);

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Cargando...</p>;

    return (
        <div>
            <h1>Bienvenido, {user.nombre}!</h1>
            <p>Email: {user.correo}</p>
            <p>Rol: {user.rol}</p>
        </div>
    );
};

export default Dashboard;