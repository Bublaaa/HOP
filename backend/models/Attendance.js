import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    clockIn: {
      type: Date, // HH:mm:ss format
    },
    clockOut: {
      type: Date, // HH:mm:ss format
    },
    inReport: {
      type: String,
    },
    outReport: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["early", "on time", "late", "absent", "invalid", "empty"],
      default: "empty",
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
