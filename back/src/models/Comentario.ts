import mongoose, { Schema, Document } from "mongoose";

export interface IComentario extends Document {
  contenido: string;
  autor: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  fechaCreacion: Date;
}

const ComentarioSchema = new Schema<IComentario>({
  contenido: { type: String, required: true },
  autor: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  fechaCreacion: { type: Date, default: Date.now },
});

export default mongoose.model<IComentario>("Comentario", ComentarioSchema);
