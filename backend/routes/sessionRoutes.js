import express from "express";
import {
  createSession,
  getMySessions,
  confirmSession,
  cancelSession,
  completeSession,
  submitReview,
} from "../controllers/sessionController.js";



import { restrictTo } from "../middleware/roleMiddleware.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const sessionRoutes = express.Router();

sessionRoutes.use(protectRoute);

sessionRoutes.post(
  "/",
  restrictTo("student"),
  createSession
);

sessionRoutes.get(
  "/my",
  getMySessions
);

sessionRoutes.put(
  "/:id/confirm",
  restrictTo("alumni"),
  confirmSession
);

sessionRoutes.put(
  "/:id/cancel",
  cancelSession
);

sessionRoutes.put(
  "/:id/complete",
  restrictTo("alumni"),
  completeSession
);

sessionRoutes.post(
  "/:id/review",
  restrictTo("student"),
  submitReview
);

export default sessionRoutes;