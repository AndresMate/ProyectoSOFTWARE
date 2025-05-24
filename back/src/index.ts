import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db"; // Asegúrate de que la ruta sea correcta
import authRoutes from "./routes/authRoutes";
import usuariosRoutes from './routes/usuariosRoutes';
import postRoutes from "./routes/postRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import cors from "cors";

dotenv.config();
connectDB(); // Se conecta a la base de datos

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json()); // Permite recibir JSON en los requests

//RUTAS
app.use("/api/auth", authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Servidor corriendo en el puerto ${PORT}`));
