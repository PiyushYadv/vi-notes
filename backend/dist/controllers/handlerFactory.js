"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const createOne = (Model) => (0, asyncHandler_1.default)(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            data: doc,
        },
    });
});
const getAll = (Model) => (0, asyncHandler_1.default)(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId)
        filter = { tour: req.params.tourId };
    const features = new apiFeatures_1.default(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.query;
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: doc.length,
        data: {
            data: doc,
        },
    });
});
const getOne = (Model, popOptions) => (0, asyncHandler_1.default)(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions)
        query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new appError_1.default("No document found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            data: doc,
        },
    });
});
const updateOne = (Model) => (0, asyncHandler_1.default)(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new appError_1.default("No document found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            data: doc,
        },
    });
});
const deleteOne = (Model) => (0, asyncHandler_1.default)(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new appError_1.default("No document found with that ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
});
exports.default = {
    createOne,
    getAll,
    getOne,
    updateOne,
    deleteOne,
};
