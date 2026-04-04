"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSendToken = exports.signToken = void 0;
const jwt = require("jsonwebtoken");
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.signToken = signToken;
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    const cookieExpiresInDays = Number(process.env.JWT_COOKIE_EXPIRES_IN || 7);
    const cookieMaxAge = cookieExpiresInDays * 24 * 60 * 60 * 1000;
    const cookieOptions = {
        expires: new Date(Date.now() + cookieMaxAge),
        maxAge: cookieMaxAge,
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    };
    // if (process.env.NODE_ENV === 'production') {
    //   cookieOptions.secure = true;
    // }
    res.cookie("jwt", token, cookieOptions);
    // Remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
exports.createSendToken = createSendToken;
