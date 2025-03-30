import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  usuarioDestino: mongoose.Types.ObjectId; // A quién va dirigida la notificación
  usuarioAccion: mongoose.Types.ObjectId; // Quién realizó la acción
  tipo: "comentario" | "like" | "respuesta"; // Tipo de notificación
  postRelacionado?: mongoose.Types.ObjectId; // En caso de ser sobre un post
  comentarioRelacionado?: mongoose.Types.ObjectId; // En caso de ser sobre un comentario
  leido: boolean; // Si el usuario ya la vio
  fecha: Date;
}

const NotificationSchema = new Schema<INotification>({
  usuarioDestino: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  usuarioAccion: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  tipo: { type: String, enum: ["comentario", "like", "respuesta"], required: true },
  postRelacionado: { type: Schema.Types.ObjectId, ref: "Post" },
  comentarioRelacionado: { type: Schema.Types.ObjectId, ref: "Comentario" },
  leido: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>("Notification", NotificationSchema);
