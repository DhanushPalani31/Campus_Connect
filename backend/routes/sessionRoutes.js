import express from "express";
import {
  createSession,
  getMySessions,
  confirmSession,
  cancelSession,
  completeSession,
  submitReview,
} from "../controllers/sessionController.js";

import { restrictTo } from "../middleware/authorize.js";
import { protectRoute } from "../middleware/authmiddleware.js";

const router = express.Router();

router.use(protectRoute);

router.post(
  "/",
  restrictTo("student"),
  createSession
);

router.get(
  "/my",
  getMySessions
);

router.put(
  "/:id/confirm",
  restrictTo("alumni"),
  confirmSession
);

router.put(
  "/:id/cancel",
  cancelSession
);

router.put(
  "/:id/complete",
  restrictTo("alumni"),
  completeSession
);

router.post(
  "/:id/review",
  restrictTo("student"),
  submitReview
);

export default router;