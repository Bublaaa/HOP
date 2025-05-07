import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    outpostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outpost",
      required: true,
    },
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);
