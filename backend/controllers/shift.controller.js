import { Shift } from "../models/Shift.js";
import { Schedule } from "../models/Schedule.js";

import { generateAttendanceSession } from "../utils/attendanceHelper.js";
import QRCode from "qrcode";

// * * GET ALL
export const getAllShift = async (req, res) => {
  try {
    const shifts = await Shift.find().sort({ name: 1 });
    if (shifts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Shifts not found" });
    }
    res.status(200).json({
      success: true,
      message: "Success get all shifts",
      shifts: shifts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * GET DETAIL
export const getShiftDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const shift = await Shift.findById(id);
    if (!shift) {
      return res
        .status(404)
        .json({ success: false, message: "Shift not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Success get shift data", shift: shift });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * CREATE
export const createShift = async (req, res) => {
  let { name, startTime, endTime } = req.body;
  name = name.toLowerCase();
  try {
    if (!name || !startTime || !endTime) {
      return res.status(404).json({
        success: false,
        message: "Shift name & time range is required",
      });
    }
    const isAlreadyExist = await Shift.findOne({ name });
    if (isAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Shift is already exist" });
    }
    const newShift = new Shift({
      name: name,
      startTime: startTime,
      endTime: endTime,
    });
    await newShift.save();
    res.status(201).json({
      success: true,
      message: "Success add new shift",
      shift: newShift,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * UPDATE
export const updateShift = async (req, res) => {
  const { id } = req.params;
  let { name, startTime, endTime } = req.body;
  name = name.toLowerCase();
  try {
    if (!name || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Shift name & time range is required",
      });
    }
    const isShiftExist = await Shift.findById(id);
    if (!isShiftExist) {
      return res
        .status(404)
        .json({ success: false, message: "Shift not found" });
    }
    const isDuplicate = await Shift.findOne({
      name: name,
      _id: { $ne: id }, // Exclude the current shift from the check
    });

    if (isDuplicate) {
      return res
        .status(400)
        .json({ success: false, message: "Shift name already exists" });
    }
    const updatedShift = await Shift.findByIdAndUpdate(id, {
      name: name,
      startTime: startTime,
      endTime: endTime,
    });
    res.status(200).json({
      success: true,
      message: "Successfully updated shift",
      shift: updatedShift,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * DELETE
export const deleteShift = async (req, res) => {
  const { id } = req.params;
  try {
    const isShiftExist = await Shift.findById(id);
    if (!isShiftExist) {
      return res
        .status(404)
        .json({ success: false, message: "Shift not found" });
    }
    const scheduleCount = await Schedule.countDocuments({ shiftId: id });
    if (scheduleCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Schedule data for that outpost exist",
      });
    }

    await Shift.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Shift deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateQrCode = async (req, res) => {
  const API_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5002/api/"
      : "/api/";
  const { outpostId } = req.body;
  try {
    const shifts = await Shift.find().sort({ name: 1 });
    const sessionId = generateAttendanceSession(shifts);
    // ** THIS IS URL TO BE SEND
    const attendanceUrl = `${API_URL}attendance/create/${outpostId}-${sessionId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(attendanceUrl);
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "No active shift found for this time.",
      });
    }
    if (!qrCodeDataUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to generate image" });
    }
    res.status(200).json({
      success: true,
      sessionId,
      qrCode: qrCodeDataUrl, // base64 image
      attendanceUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate QR Code",
      error: error.message,
    });
  }
};
