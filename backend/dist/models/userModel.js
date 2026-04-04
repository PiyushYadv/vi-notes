"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [isValidEmail, "Please provide a valid email"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must have more or equal than 8 characters"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same!",
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});
userSchema.pre("save", async function () {
    // Only run this function if password was actually modified
    if (!this.isModified("password"))
        return;
    // Hash the password with cost of 12
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
});
userSchema.pre("save", function () {
    if (!this.isModified("password") || this.isNew)
        return;
    this.passwordChangedAt = new Date(Date.now() - 1000);
});
userSchema.pre(/^find/, function () {
    this.find({ active: { $ne: false } });
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcryptjs_1.default.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
