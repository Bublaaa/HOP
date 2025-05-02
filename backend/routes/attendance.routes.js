import express from "express";
import {
  getAllAttendances,
  getAttendanceDetail,
  punchIn,
  punchOut,
  deleteAttendance,
  updateAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.get("/getAll", getAllAttendances);
router.get("/getDetail/:id", getAttendanceDetail);
router.post("/clock-in", punchIn);
router.put("/clock-out/:id", punchOut);
router.put("/update/:id", updateAttendance);
router.delete("/delete/:id", deleteAttendance);

export default router;
