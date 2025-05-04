import { Outpost } from "../models/Outpost.js";
import { Schedule } from "../models/Schedule.js";

// * * GET ALL
export const getAllOutpost = async (req, res) => {
  try {
    const outposts = await Outpost.find().sort({ name: 1 });
    if (outposts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No outposts found",
        outposts: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Success get all outposts",
      outposts: outposts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * GET DETAIL
export const getOutpostDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const outpost = await Outpost.findById(id);
    if (!outpost) {
      return res.status(404).json({
        success: false,
        message: "Outpost not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Success get outpost detail",
      outpost: outpost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * CREATE
export const createOutpost = async (req, res) => {
  let { name, latitude, longitude } = req.body;
  name = name.toLowerCase();
  try {
    if (!name || !latitude || !longitude) {
      return res
        .status(400)
        .json({ success: false, message: "Name and Coordinates are required" });
    }
    const isAlreadyExist = await Outpost.findOne({ name });
    if (isAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Outpost already exist" });
    }
    const newOutpost = new Outpost({
      name: name,
      latitude: latitude,
      longitude: longitude,
    });
    await newOutpost.save();
    res.status(201).json({
      success: true,
      message: "New outpost created",
      outpost: newOutpost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// * * UPDATE
export const updateOutpost = async (req, res) => {
  const { id } = req.params;
  let { name, latitude, longitude } = req.body;

  try {
    if (!name || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Name and Coordinates are required",
      });
    }

    const isOutpostExist = await Outpost.findById(id);
    if (!isOutpostExist) {
      return res.status(404).json({
        success: false,
        message: "Outpost not found",
      });
    }

    const updatedOutpost = await Outpost.findByIdAndUpdate(id, {
      name: name.toLowerCase(),
      latitude,
      longitude,
    });

    res.status(201).json({
      success: true,
      message: "Outpost updated successfully",
      outpost: updatedOutpost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// * * DELETE
export const deleteOutpost = async (req, res) => {
  const { id } = req.params;
  try {
    const isOutpostExist = await Outpost.findById(id);
    if (!isOutpostExist) {
      return res
        .status(404)
        .json({ success: false, message: "Outpost not found" });
    }
    const scheduleCount = await Schedule.countDocuments({ outpostId: id });
    if (scheduleCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Schedule data for that outpost exist",
      });
    }
    await Outpost.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Outpost deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
