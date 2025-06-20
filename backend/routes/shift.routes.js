import express from "express";
import {
  getAllShift,
  getShiftDetail,
  createShift,
  updateShift,
  deleteShift,
  generateQrCode,
} from "../controllers/shift.controller.js";

const router = express.Router();

router.get("/getAll", getAllShift);
router.get("/getDetail/:id", getShiftDetail);
router.post("/create", createShift);
router.put("/update/:id", updateShift);
router.delete("/delete/:id", deleteShift);
router.post("/generate-qr", generateQrCode);

export default router;
