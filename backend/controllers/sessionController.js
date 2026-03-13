import Session from "../models/Session.js";
import Alumni from "../models/AlumniProfile.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export const createSession = async (req, res, next) => {
  try {
    const { alumni: alumniProfileId, duration, scheduledAt, topic, message } = req.body;

    if (!alumniProfileId) {
      return next(new AppError("Alumni profile ID is required", 400));
    }

    if (!scheduledAt || !duration || !topic) {
      return next(new AppError("duration, scheduledAt and topic are required", 400));
    }

   
    const profile = await Alumni.findById(alumniProfileId).populate("user", "name email role");

    if (!profile) {
      return next(new AppError("Alumni profile not found", 404));
    }

  
    if (!profile.user || profile.user.role !== "alumni") {
      return next(new AppError("Invalid alumni", 404));
    }

    
    const rate = profile.sessionRate || 0;
    const amount = Number(duration) === 60 ? rate * 2 : rate;

    const session = await Session.create({
      student: req.user._id,
      alumni: profile.user._id,     // User _id of the alumni (for auth checks in other routes)
      alumniProfile: profile._id,   // AlumniProfile _id (for populate, ratings, etc.)
      duration: Number(duration),
      scheduledAt,
      topic,
      message: message || "",
      amount,
      status: "pending",
      paymentStatus: "unpaid",
    });

    return res.status(201).json({
      success: true,
      session,
    });

  } catch (error) {
    next(error);
  }
};

export const getMySessions = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = {};

    if (req.user.role === "student") {
      query.student = req.user._id;
    }

    if (req.user.role === "alumni") {
      query.alumni = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .populate("student", "name email profilePhoto")
      .populate("alumni", "name email")
      .populate("alumniProfile", "currentRole company")
      .sort({ scheduledAt: -1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });

  } catch (error) {
    next(error);
  }
};

export const confirmSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      alumni: req.user._id,
    });

    if (!session) {
      return next(new AppError("Session not found", 404));
    }

    if (session.status !== "pending") {
      return next(new AppError("Session already processed", 400));
    }

    session.status = "confirmed";

    if (req.body.meetLink) {
      session.meetLink = req.body.meetLink;
    }

    await session.save();

    return res.status(200).json({
      success: true,
      session,
    });

  } catch (error) {
    next(error);
  }
};

export const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return next(new AppError("Session not found", 404));
    }

    const isOwner =
      session.student.toString() === req.user._id.toString() ||
      session.alumni.toString() === req.user._id.toString();

    if (!isOwner) {
      return next(new AppError("Unauthorized", 403));
    }

    if (session.status === "completed" || session.status === "cancelled") {
      return next(new AppError("Cannot cancel this session", 400));
    }

    session.status = "cancelled";
    session.cancelReason = req.body.reason || "";

    if (session.paymentStatus === "paid") {
      session.paymentStatus = "refunded";
    }

    await session.save();

    return res.status(200).json({
      success: true,
      session,
    });

  } catch (error) {
    next(error);
  }
};

export const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      alumni: req.user._id,
    });

    if (!session) {
      return next(new AppError("Session not found", 404));
    }

    if (session.status !== "confirmed") {
      return next(new AppError("Session not confirmed", 400));
    }

    session.status = "completed";
    await session.save();

    await Alumni.findByIdAndUpdate(session.alumniProfile, {
      $inc: { totalSessions: 1 },
    });

    return res.status(200).json({
      success: true,
      session,
    });

  } catch (error) {
    next(error);
  }
};

export const submitReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError("Rating must be between 1 and 5", 400));
    }

    const session = await Session.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: "completed",
    });

    if (!session) {
      return next(new AppError("Session not found or not completed", 404));
    }

    if (session.review?.rating) {
      return next(new AppError("Already reviewed", 400));
    }

    session.review = {
      rating,
      comment: comment || "",
      createdAt: Date.now(),
    };

    await session.save();

    // Recalculate alumni average rating from all completed sessions
    const reviews = await Session.find({
      alumni: session.alumni,
      status: "completed",
      "review.rating": { $exists: true },
    });

    const totalRating = reviews.reduce((sum, item) => sum + item.review.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(2));

    await Alumni.findByIdAndUpdate(session.alumniProfile, {
      rating: averageRating,
      totalReviews: reviews.length,
    });

    return res.status(200).json({
      success: true,
      review: session.review,
    });

  } catch (error) {
    next(error);
  }
};