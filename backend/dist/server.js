"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: "config.env" });
process.on("uncaughtException", (err) => {
    console.error(err.name, err.message, err);
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    process.exit(1);
});
const DB = process.env.MONGODB_URI;
mongoose_1.default.connect(DB).then(() => console.log("DB connection successful!"));
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 3000;
const server = app_1.default.listen(port, () => {
    console.log("Server is running on port 3000 🚀");
});
process.on("unhandledRejection", (err) => {
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
