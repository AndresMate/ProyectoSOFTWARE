import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  titulo: string;
  contenido: string;
  autor: mongoose.Types.ObjectId; // Referencia al usuario
  comentarios: mongoose.Types.ObjectId[]; // Referencias a comentarios
  likes: mongoose.Types.ObjectId[]; // Almacena los usuarios que han dado like
  fechaCreacion: Date;
}

const PostSchema = new Schema<IPost>(
  {
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    autor: { type: Schema.Types.ObjectId, ref: "Usuario", required: true }, // Relación con Usuario
    comentarios: [{ type: Schema.Types.ObjectId, ref: "Comentario" }], // Relación con comentarios
    likes: [{ type: Schema.Types.ObjectId, ref: "Usuario" }], // Lista de usuarios que dieron like
    fechaCreacion: { type: Date, default: Date.now }, // Fecha de creación automática
  },
  { timestamps: true }
);


export default mongoose.model<IPost>("Post", PostSchema);
