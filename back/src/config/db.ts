import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "foro",
    });
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
