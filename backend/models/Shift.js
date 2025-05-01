import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startTime: {
      type: String, // Stored as "HH:mm" (24-hour format)
      required: true,
    },
    endTime: {
      type: String, // Stored as "HH:mm"
      required: true,
    },
  },
  { timestamps: true }
);

export const Shift = mongoose.model("Shift", shiftSchema);
