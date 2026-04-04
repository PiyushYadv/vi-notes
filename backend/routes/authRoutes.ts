import express from "express";

import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  restrictTo,
} from "../controllers/authController";

import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
} from "../controllers/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.get("/me", getMe, getUser);

// Restricted all routes after this middleware
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export { router as userRouter };
