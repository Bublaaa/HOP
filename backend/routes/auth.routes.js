import express from "express";
import {
  login,
  logout,
  signup,
  checkAuth,
  getAllUser,
  getUserDetail,
  updateUser,
  deleteUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.get("/users", getAllUser);
router.get("/user/:id", getUserDetail);

router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
