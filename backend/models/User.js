import mongoose from "mongoose";

// Auto add created at & updated at with "{timestamps:true}"
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    position: {
      type: String,
      enum: ["security", "outpost", "admin"],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
