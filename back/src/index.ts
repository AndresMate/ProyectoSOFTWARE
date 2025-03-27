import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API del foro funcionando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

connectDB();