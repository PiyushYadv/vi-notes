"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getMe = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const handlerFactory_1 = __importDefault(require("./handlerFactory"));
exports.getAllUsers = handlerFactory_1.default.getAll(userModel_1.default);
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.getMe = getMe;
exports.getUser = handlerFactory_1.default.getOne(userModel_1.default);
// This route will never be used instead, use signup
// exports.createUser = factory.createOne(User);
const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined! Please use /signup instead",
    });
};
exports.createUser = createUser;
//! Do NOT update passwords with these
exports.updateUser = handlerFactory_1.default.updateOne(userModel_1.default);
exports.deleteUser = handlerFactory_1.default.deleteOne(userModel_1.default);
