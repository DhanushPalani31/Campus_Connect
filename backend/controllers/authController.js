import { AppError } from "../middleware/errorHandler.js";
import Alumni from "../models/AlumniProfile.js";
import User from "../models/User.js";
import { generateToken, setTokenCookie } from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    // ✅ FIX 4: Added `college` to destructuring — RegisterPage sends it but old code never
    // saved it, so user.college was always undefined after registration.
    const { name, email, password, role, college } = req.body;

    if (!name || !email || !password || !role) {
      return next(new AppError("All fields are required", 400));
    }

    const checkExistUser = await User.findOne({ email });

    if (checkExistUser) {
      return next(new AppError("Email already registered", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      college: college || "",   // ✅ FIX 4: Now saved to DB
    });

    if (role === "alumni") {
      await Alumni.create({
        user: user._id,
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college, 
        profilePhoto: user.profilePhoto,
      },
    });

  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        profilePhoto: user.profilePhoto,
      },
    });

  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out",
    });

  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    let profile = null;

    if (req.user.role === "alumni") {
      profile = await Alumni.findOne({ user: req.user._id });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        college: req.user.college,
        profilePhoto: req.user.profilePhoto,
      },
      profile,
    });

  } catch (error) {
    next(error);
  }
};