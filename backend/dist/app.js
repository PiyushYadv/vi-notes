"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const authRoutes_1 = require("./routes/authRoutes");
function sanitizeValue(value) {
    if (typeof value === "string") {
        return value.replace(/[<>$]/g, "");
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [
            key.replace(/[$.]/g, ""),
            sanitizeValue(nestedValue),
        ]));
    }
    return value;
}
const app = (0, express_1.default)();
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.enable("trust proxy");
app.set("view engine", "pug");
app.set("views", path_1.default.join(__dirname, "views"));
// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Set security HTTP headers
app.use((0, cors_1.default)({
    origin: frontendOrigin,
    credentials: true,
}));
app.options("/{*any}", (0, cors_1.default)({
    origin: frontendOrigin,
    credentials: true,
}));
app.use((0, helmet_1.default)());
// Development Logging
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Limit requests from same API
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP. Please try again in an hour!",
});
app.use("/api", limiter);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use((0, cookie_parser_1.default)());
// Express 5 compatible request sanitization
app.use((req, _res, next) => {
    req.body = sanitizeValue(req.body);
    req.params = sanitizeValue(req.params);
    next();
});
// Prevent parameter pollution
app.use((0, hpp_1.default)());
app.use((0, compression_1.default)());
// Test middleware
app.use((req, res, next) => {
    // console.log('Hello from middleware :)');
    req.requestTime = new Date().toISOString();
    next();
});
// Routes
app.use("/api", authRoutes_1.userRouter);
app.all("/{*any}", (req, res, next) => {
    // res.status(404).json({
    //   status: 'fail',
    //   message: `Can't find ${req.originalUrl} on this server!`,
    // });
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
