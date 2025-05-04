import express from "express";
import {
  login,
  logout,
  signup,
  checkAuth,
  getAllUser,
  getUserDetail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.get("/users", getAllUser);
router.get("/user/:id", getUserDetail);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// router.post("/verify-email", verifyEmail);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

export default router;
