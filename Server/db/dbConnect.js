import mongoose from "mongoose";
import "dotenv/config";

const url = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url, {
      dbName: "MERN_AUTH",
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });

    console.log(
      `MongoDB connected: ${conn.connection.host}:${conn.connection.port}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
