import express from "express";
import {
  getAllSchedule,
  getScheduleDetail,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller.js";

const router = express.Router();

router.get("/getAll", getAllSchedule);
router.get("/getDetail/:id", getScheduleDetail);
router.post("/create", createSchedule);
router.put("/update/:id", updateSchedule);
router.delete("/delete/:id", deleteSchedule);

export default router;
