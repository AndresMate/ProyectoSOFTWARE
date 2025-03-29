import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db"; // Asegúrate de que la ruta sea correcta
import authRoutes from "./routes/authRoutes";
import usuariosRoutes from './routes/usuariosRoutes';

dotenv.config();
connectDB(); // Se conecta a la base de datos

const app = express();
app.use(express.json()); // Permite recibir JSON en los requests

app.use("/api/auth", authRoutes);
app.use('/api/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Servidor corriendo en el puerto ${PORT}`));
