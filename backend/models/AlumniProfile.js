import mongoose, { Schema } from "mongoose";

const alumniSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    bio: {
      type: String,
      maxlength: 500,
      required: true,
    },

    currentRole: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      min: 0,
      max: 50,
      required: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    sessionRate: {
      type: Number,
      min: 0,
      required: true,
    },

    linkedIn: String,
    github: String,
    website: String,

    education: {
      degree: String,
      college: String,
      year: Number,
    },

    availability: {
      days: [String],
      time: String,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalSessions: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alumni", alumniSchema);