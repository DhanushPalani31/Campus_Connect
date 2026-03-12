import Alumni from "../models/AlumniProfile.js";
import { AppError } from "../middleware/errorHandler.js";

export const getAllAlumni = async (req, res, next) => {
  try {
    const {
      search,
      skill,
      minRating,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        { bio: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
        { currentRole: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by skill
    if (skill) {
      query.skills = { $regex: skill, $options: "i" };
    }

    // Filter by rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (sort === "rating") {
      sortOption = { rating: -1 };
    }

    if (sort === "price_low") {
      sortOption = { sessionRate: 1 };
    }

    if (sort === "price_high") {
      sortOption = { sessionRate: -1 };
    }

    if (sort === "experience") {
      sortOption = { experience: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const alumni = await Alumni.find(query)
      .populate("user", "name email profilePhoto")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Alumni.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: alumni.length,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      alumni,
    });

  } catch (error) {
    next(error);
  }
};

export const getAlumniById = async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.params.id)
      .populate("user", "name email profilePhoto college");

    if (!alumni) {
      return next(new AppError("Alumni not found", 404));
    }

    return res.status(200).json({
      success: true,
      alumni,
    });

  } catch (error) {
    next(error);
  }
};


export const updateAlumniProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "bio",
      "currentRole",
      "company",
      "experience",
      "skills",
      "sessionRate",
      "linkedIn",
      "github",
      "website",
      "education",
      "availability",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const profile = await Alumni.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email profilePhoto");

    if (!profile) {
      return next(new AppError("Profile not found", 404));
    }

    return res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {
    next(error);
  }
};