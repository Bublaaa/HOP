import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    clockIn: {
      type: Date,
      required: true, // HH:mm:ss format
    },
    clockOut: {
      type: Date, // HH:mm:ss format
    },
    report: {
      type: String,
      // required: true,
    },
    latitudeIn: {
      type: Number,
      required: true,
    },
    longitudeIn: {
      type: Number,
      required: true,
    },
    latitudeOut: {
      type: Number,
    },
    longitudeOut: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["early", "on time", "late", "absent", "invalid", "empty"],
      default: "empty",
      required: true,
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);
