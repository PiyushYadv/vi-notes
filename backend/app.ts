import express from "express";
import path from "path";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";

import { userRouter } from "./routes/authRoutes";

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/[<>$]/g, "");
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key.replace(/[$.]/g, ""),
        sanitizeValue(nestedValue),
      ]),
    );
  }

  return value;
}

const app = express();
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const publicDirectory = path.resolve(process.cwd(), "public");

app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);

app.set("view engine", "pug");
app.set("views", path.resolve(process.cwd(), "views"));

// Serving static files
app.use(express.static(publicDirectory));

// Set security HTTP headers
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);
app.options(
  "/{*any}",
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);

app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Express 5 compatible request sanitization
app.use((req, _res, next) => {
  req.body = sanitizeValue(req.body);
  req.params = sanitizeValue(req.params) as typeof req.params;
  next();
});

// Prevent parameter pollution
app.use(hpp());

app.use(compression());

// Test middleware
app.use((req: any, res, next) => {
  // console.log('Hello from middleware :)');
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api", userRouter);
app.all("/{*any}", (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
