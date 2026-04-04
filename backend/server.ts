import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "config.env" });

process.on("uncaughtException", (err) => {
  console.error(err.name, err.message, err);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

const DB = process.env.MONGODB_URI as string;

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

import app from "./app";

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("Server is running on port 3000 🚀");
});

process.on("unhandledRejection", (err: any) => {
  console.error(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
