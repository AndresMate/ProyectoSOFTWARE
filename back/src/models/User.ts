import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Cambiado de "correo" a "email"
  password: { type: String, required: true },
  rol: { type: String, enum: ["usuario", "moderador", "admin"], default: "usuario" }
});

export default mongoose.model("User", UserSchema);