import express from "express";
import {
  getAllOutpost,
  getOutpostDetail,
  createOutpost,
  updateOutpost,
  deleteOutpost,
} from "../controllers/outpost.controller.js";

const router = express.Router();

router.get("/getAll", getAllOutpost);
router.get("/getDetail/:id", getOutpostDetail);
router.post("/create", createOutpost);
router.put("/update/:id", updateOutpost);
router.delete("/delete/:id", deleteOutpost);

export default router;
