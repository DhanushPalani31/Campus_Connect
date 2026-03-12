import express from "express";
import {
  getAllAlumni,
  getAlumniById,
  updateAlumniProfile,
} from "../controllers/alumniController.js";

import { restrictTo } from "../middleware/authorize.js";
import { protectRoute } from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(protectRoute)
router.get("/", getAllAlumni);

router.get("/:id", getAlumniById);

router.put(
  "/profile",
  restrictTo("alumni"),
  updateAlumniProfile
);

export default router;