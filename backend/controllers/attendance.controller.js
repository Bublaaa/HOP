import { Attendance } from "../models/Attendance.js";
import { Schedule } from "../models/Schedule.js";
import { Shift } from "../models/Shift.js";
import { Outpost } from "../models/Outpost.js";

// **  GET ALL
export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find().sort({ name: 1 });
    if (attendances.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Attendances not found" });
    }
    res.status(200).json({
      success: true,
      message: "Success get all attendances",
      attendances: attendances,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// **  GET DETAIL
export const getAttendanceDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Success get attendance detail",
      attendance: attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// **  CREATE
export const punchIn = async (req, res) => {
  const { scheduleId, latitude, longitude } = req.body;
  let status = "empty";
  try {
    const clockIn = Date.now();
    if (!scheduleId) {
      return res
        .status(400)
        .json({ success: false, message: "Schedule id is empty" });
    }
    if (!latitude) {
      return res
        .status(400)
        .json({ success: false, message: "Latitude are required" });
    }
    if (!longitude) {
      return res
        .status(400)
        .json({ success: false, message: "Longitude are required" });
    }
    const isAlreadyExist = await Attendance.findOne({
      scheduleId: scheduleId,
    });
    if (isAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Already clock in" });
    }
    const schedule = await Schedule.findById(scheduleId);
    const outpost = await Outpost.findById(schedule.outpostId);
    const shift = await Shift.findById(schedule.shiftId);
    if (!schedule || !outpost || !shift) {
      return res.status(404).json({
        success: false,
        message: "Schedule, outpost, or shift not found",
      });
    }
    const distance = calculateDistance(
      outpost.latitude,
      outpost.longitude,
      latitude,
      longitude
    );
    status = getTimeCategory(shift.startTime, clockIn);
    const MAX_ALLOWED_DISTANCE = 10; // in meters
    if (distance > MAX_ALLOWED_DISTANCE) {
      status = "invalid";
    }
    const newAttendance = new Attendance({
      scheduleId: scheduleId,
      clockIn: clockIn,
      latitudeIn: latitude,
      longitudeIn: longitude,
      status: status,
    });
    await newAttendance.save();
    res.status(201).json({
      success: true,
      message: "Success create attendance",
      attendance: newAttendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// **  UPDATE
export const punchOut = async (req, res) => {
  const { id } = req.params;
  const { scheduleId, latitude, longitude, report } = req.body;
  try {
    if (!scheduleId || !latitude || !longitude) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const clockOut = Date.now();
    const attendance = await Attendance.findById(id);
    const schedule = await Schedule.findById(scheduleId);
    const outpost = await Outpost.findById(schedule.outpostId);
    const shift = await Shift.findById(schedule.shiftId);
    if (!schedule || !outpost || !shift || !attendance) {
      return res.status(404).json({
        success: false,
        message: "Schedule, attendance, outpost, or shift not found",
      });
    }
    if (attendance.clockOut) {
      return res.status(400).json({
        success: false,
        message: "Already clocked out",
      });
    }
    const distance = calculateDistance(
      outpost.latitude,
      outpost.longitude,
      latitude,
      longitude
    );
    if (distance > 10) {
      return res.status(400).json({
        success: false,
        message: "Location too far",
      });
    }
    const updatedAttendance = await Attendance.findByIdAndUpdate(id, {
      clockOut: clockOut,
      report: report,
      latitudeOut: latitude,
      longitudeOut: longitude,
    });
    res.status(200).json(
      {
        success: true,
        message: "Success punch out",
        attendance: updatedAttendance,
      },
      { new: true }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// **  UPDATE FOR ADMIN
export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const {
    scheduleId,
    clockIn,
    clockOut,
    report,
    latitudeIn,
    longitudeIn,
    latitudeOut,
    longitudeOut,
    status,
  } = req.body;
  try {
    if (
      !scheduleId ||
      !clockIn ||
      !clockOut ||
      !latitudeIn ||
      !longitudeIn ||
      !latitudeOut ||
      !longitudeOut ||
      !status
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const updatedAttendance = await Attendance.findByIdAndUpdate(id, {
      scheduleId: scheduleId,
      clockIn: clockIn,
      clockOut: clockOut,
      report: report,
      latitudeIn: latitudeIn,
      longitudeIn: longitudeIn,
      latitudeOut: latitudeOut,
      longitudeOut: longitudeOut,
      status: status,
    });
    res.status(200).json(
      {
        success: true,
        message: "Success update attendance",
        attendance: updatedAttendance,
      },
      { new: true }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// **  DELETE
export const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }
    await Attendance.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Success delete attendance" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ** Utils Function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers (3958.8 for miles)
  const toRad = (degree) => (degree * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // returns distance in meters
}

function getTimeCategory(expectedTimeStr, actualTimeStr) {
  const expected = new Date(expectedTimeStr);
  const actual = new Date(actualTimeStr);
  if (isNaN(expected) || isNaN(actual)) return "empty";
  const diffInMinutes = Math.floor((actual - expected) / 60000); // positive = late, negative = early
  switch (true) {
    case diffInMinutes <= -10:
      return "early";
    case diffInMinutes > -10 && diffInMinutes <= 0:
      return "on time";
    case diffInMinutes > 0 && diffInMinutes <= 15:
      return "late";
    case diffInMinutes >= 45:
      return "absent";
    default:
      return "empty";
  }
}
