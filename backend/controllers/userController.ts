import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import factory from "./handlerFactory";

export const getAllUsers = factory.getAll(User);

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  (req as any).params.id = (req as any).user.id;
  next();
};

export const getUser = factory.getOne(User);

// This route will never be used instead, use signup
// exports.createUser = factory.createOne(User);
export const createUser = (req: Request, res: Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

//! Do NOT update passwords with these
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
