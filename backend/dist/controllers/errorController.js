"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    // B) RENDERED WEBSITE
    console.error("ERROR 💥", err);
    return res.status(err.statusCode).json({
        title: "Something went wrong!",
        msg: err.message,
    });
};
const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith("/api")) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error("ERROR 💥", err);
        // 2) Send generic message
        return res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
    // B) RENDERED WEBSITE
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            title: "Something went wrong!",
            msg: err.message,
        });
    }
    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(err.statusCode).json({
        title: "Something went wrong!",
        msg: "Please try again later.",
    });
};
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const duplicatedField = Object.keys(err.keyValue || {})[0];
    const fieldLabel = duplicatedField === "email" ? "email address" : duplicatedField;
    const message = duplicatedField === "email"
        ? "That email address is already in use. Try logging in instead."
        : `That ${fieldLabel} is already in use. Please choose another one.`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = errors.join(" ");
    return new appError_1.default(message, 400);
};
const handleJWTError = () => new appError_1.default("Your session is invalid. Please log in again.", 401);
const handleJWTExpiredError = () => new appError_1.default("Your session has expired. Please log in again.", 401);
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError")
            handleJWTError();
        if (error.name === "TokenExpiredError")
            handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
exports.default = globalErrorHandler;
