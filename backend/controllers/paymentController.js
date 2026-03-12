import crypto from "crypto";
import razorpay from "../utils/razorpayInstance.js";
import Session from "../models/Session.js";
import { AppError } from "../middleware/errorHandler.js";

// POST /api/payments/create-order
// Student calls this to get a Razorpay order before checkout
export const createOrder = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return next(new AppError("Session ID is required", 400));
    }

    // Find the session and verify it belongs to this student
    const session = await Session.findOne({
      _id: sessionId,
      student: req.user._id,
    });

    if (!session) {
      return next(new AppError("Session not found", 404));
    }

    if (session.paymentStatus === "paid") {
      return next(new AppError("Session already paid", 400));
    }

    // Create Razorpay order
    // IMPORTANT: Razorpay uses paise — multiply INR by 100
    const order = await razorpay.orders.create({
      amount: session.amount * 100,
      currency: "INR",
      receipt: `session_${sessionId}`,
      notes: {
        sessionId: sessionId.toString(),
        studentId: req.user._id.toString(),
      },
    });

    // Save orderId to session for verification later
    session.razorpayOrderId = order.id;
    await session.save();

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,       // in paise
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,  // send to frontend for checkout
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/verify
// After Razorpay checkout succeeds, frontend sends these 3 values to verify
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, sessionId } =
      req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !sessionId) {
      return next(new AppError("All payment fields are required", 400));
    }

    // Step 1: Recreate the signature using HMAC SHA256
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Step 2: Compare — if they don't match, payment is fake/tampered
    if (expectedSignature !== razorpaySignature) {
      return next(new AppError("Payment verification failed", 400));
    }

    // Step 3: Update session as paid
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, student: req.user._id },
      {
        paymentStatus: "paid",
        razorpayPaymentId,
      },
      { new: true }
    );

    if (!session) {
      return next(new AppError("Session not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      session,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/payments/history
// Alumni sees their earnings
export const getPaymentHistory = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      alumni: req.user._id,
      paymentStatus: "paid",
    })
      .populate("student", "name email profilePhoto")
      .sort({ createdAt: -1 });

    // Group earnings by month for chart data
    const monthlyEarnings = {};

    sessions.forEach((s) => {
      const month = new Date(s.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + s.amount;
    });

    // Convert to array for Recharts: [{ month: "Jan 2025", earnings: 2000 }]
    const chartData = Object.entries(monthlyEarnings).map(([month, earnings]) => ({
      month,
      earnings,
    }));

    const totalEarnings = sessions.reduce((sum, s) => sum + s.amount, 0);

    return res.status(200).json({
      success: true,
      totalEarnings,
      totalSessions: sessions.length,
      chartData,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};