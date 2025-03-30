import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  nombre: string;
  correo: string;
  password: string;
  rol: "usuario" | "moderador" | "admin";
  verificado: boolean;
  tokenVerificacion?: string;
}

const UserSchema = new Schema<IUser>({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["usuario", "moderador", "admin"], default: "usuario" },
  verificado: { type: Boolean, default: false },
  tokenVerificacion: { type: String },
});

export default mongoose.model<IUser>("User", UserSchema);