"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.isLoggedIn = exports.protect = exports.logout = exports.login = exports.signup = void 0;
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const email_1 = __importDefault(require("../utils/email"));
const generateToken_1 = require("../utils/generateToken");
exports.signup = (0, asyncHandler_1.default)(async (req, res, next) => {
    const newUser = await userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm || req.body.password,
    });
    const url = `${req.protocol}://${req.get("host")}/`;
    if (process.env.EMAIL_HOST) {
        await new email_1.default(newUser, url).sendWelcome();
    }
    (0, generateToken_1.createSendToken)(newUser, 201, req, res);
});
exports.login = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new appError_1.default("Please enter both your email and password.", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await userModel_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new appError_1.default("No account found with that email address.", 404));
    }
    if (!(await user.correctPassword(password, user.password))) {
        return next(new appError_1.default("That password doesn't look right.", 401));
    }
    // 3) If everything ok, send token to client
    (0, generateToken_1.createSendToken)(user, 200, req, res);
});
const logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
exports.logout = logout;
exports.protect = (0, asyncHandler_1.default)(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError_1.default("You are not logged in! Please log in to get access.", 401));
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser = await userModel_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.default("The user belonging to this token does no longer exist.", 401));
    }
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.default("User recently changed password! Please log in again.", 401));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});
// Only for rendered pages, no errors!
const isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) Verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            // 2) Check if user still exists
            const currentUser = await userModel_1.default.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
};
exports.isLoggedIn = isLoggedIn;
const restrictTo = (...roles) => (req, res, next) => {
    // roles ['admin']. role='user'
    if (!roles.includes(req.user.role)) {
        return next(new appError_1.default("You do not have permission to perform this action", 403));
    }
    next();
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, asyncHandler_1.default)(async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await userModel_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default("There is no user with email address", 404));
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get("host")}/api/resetPassword/${resetToken}`;
    // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        // await sendMail({
        //   email: user.email,
        //   subject: 'Your password reset token (valid for 10 mins)',
        //   message,
        // });
        if (!process.env.EMAIL_HOST) {
            return res.status(200).json({
                status: "success",
                message: "Password reset flow is disabled until email config is set.",
            });
        }
        await new email_1.default(user, resetURL).sendPasswordReset();
        res.status(200).json({
            status: "success",
            message: "Token sent to email",
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError_1.default("There was an error sending the email. Try again later!", 500));
    }
});
exports.resetPassword = (0, asyncHandler_1.default)(async (req, res, next) => {
    // 1) Get user based on token
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new appError_1.default("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 3) Update  changePasswordAt property for the user
    // 4) Log the user in, send JWT
    (0, generateToken_1.createSendToken)(user, 200, req, res);
});
exports.updatePassword = (0, asyncHandler_1.default)(async (req, res, next) => {
    // 1) Get user from collection
    const user = await userModel_1.default.findById(req.user.id).select("+password");
    // 2) Check if POSTED current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new appError_1.default("Your current password is wrong.", 401));
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // 4) Log user in, send JWT
    (0, generateToken_1.createSendToken)(user, 200, req, res);
});
