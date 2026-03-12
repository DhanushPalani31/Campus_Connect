import express from "express";
import {
  getAllAlumni,
  getAlumniById,
  updateAlumniProfile,
} from "../controllers/alumniController.js";

import { restrictTo } from "../middleware/roleMiddleware.js";
import { protectRoute } from "../middleware/authMiddleware.js";


const alumniRoutes = express.Router();

alumniRoutes.get("/", getAllAlumni);                                // public
alumniRoutes.get("/:id", getAlumniById);                           // public
alumniRoutes.put("/profile", protectRoute, restrictTo("alumni"), updateAlumniProfile);
export default alumniRoutes;