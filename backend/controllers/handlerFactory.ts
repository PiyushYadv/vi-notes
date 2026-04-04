import { Request, Response, NextFunction, RequestHandler } from "express";
import { Model, Document, PopulateOptions } from "mongoose";
import AppError from "../utils/appError";
import asyncHandler from "../utils/asyncHandler";
import APIFeatures from "../utils/apiFeatures";

type ModelType<T> = Model<T & Document>;

const createOne = <T>(Model: ModelType<T>): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const getAll = <T>(Model: ModelType<T>): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let filter: Record<string, unknown> = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures<T>(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      requestedAt: (req as any).requestTime,
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

const getOne = <T>(
  Model: ModelType<T>,
  popOptions?: PopulateOptions | PopulateOptions[],
): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const updateOne = <T>(Model: ModelType<T>): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

const deleteOne = <T>(Model: ModelType<T>): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export default {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
