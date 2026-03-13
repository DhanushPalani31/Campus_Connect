import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} from "../controllers/paymentController.js";

import { restrictTo } from "../middleware/roleMiddleware.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", protectRoute, restrictTo("student"), createOrder);
paymentRoutes.post("/verify", protectRoute, restrictTo("student"), verifyPayment);
paymentRoutes.get("/history", protectRoute, restrictTo("alumni"), getPaymentHistory);

export default paymentRoutes;