import { Schedule } from "../models/Schedule.js";
import { Attendance } from "../models/Attendance.js";
import { User } from "../models/User.js";
import { Outpost } from "../models/Outpost.js";
import { Shift } from "../models/Shift.js";

// * * GET ALL
export const getAllSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ name: 1 });
    if (schedules.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Success get all schedules",
      schedules: schedules,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * GET DETAIL
export const getScheduleDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Success get schedule detail",
      schedule: schedule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * CREATE
export const createSchedule = async (req, res) => {
  const { userId, outpostId, shiftId, date } = req.body;
  try {
    if (!userId || !outpostId || !shiftId || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    await checkValidId(userId, outpostId, shiftId);
    const isAlreadyExist = await Schedule.findOne({
      userId: userId,
      outpostId: outpostId,
      shiftId: shiftId,
      date: date,
    });
    if (isAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Schedule is already exist" });
    }
    const newSchedule = new Schedule({
      userId: userId,
      outpostId: outpostId,
      shiftId: shiftId,
      date: date,
    });
    await newSchedule.save();
    res.status(201).json({
      success: true,
      message: "Success create new schedule",
      schedule: newSchedule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * UPDATE
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { userId, outpostId, shiftId, date } = req.body;
  try {
    if (!userId || !outpostId || !shiftId || !date) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const isScheduleExist = await Schedule.findById(id);
    if (!isScheduleExist) {
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found" });
    }
    const isDuplicate = await Schedule.findOne({
      userId: userId,
      outpostId: outpostId,
      shiftId: shiftId,
      date: date,
      _id: { $ne: id },
    });
    if (isDuplicate) {
      return res
        .status(400)
        .json({ success: false, message: "Schedule is already exist" });
    }
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, {
      userId: userId,
      outpostId: outpostId,
      shiftId: shiftId,
      date: date,
    });
    res.status(201).json({
      success: true,
      message: "Success update schedule",
      schedule: updateSchedule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * DELETE
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const isScheduleExist = await Schedule.findById(id);
    if (!isScheduleExist) {
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found" });
    }
    const attendanceBySchedule = await Attendance.countDocuments({
      scheduleId: id,
    });
    if (attendanceBySchedule.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Schedule data for that outpost exist",
      });
    }

    await Schedule.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ** Utils function
const checkValidId = async (userId, outpostId, shiftId) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new Error("User not found");
  }

  const isOutpostExist = await Outpost.findById(outpostId);
  if (!isOutpostExist) {
    throw new Error("Outpost not found");
  }

  const isShiftExist = await Shift.findById(shiftId);
  if (!isShiftExist) {
    throw new Error("Shift not found");
  }
};
