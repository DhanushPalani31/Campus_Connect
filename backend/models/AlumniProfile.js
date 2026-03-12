import mongoose, { Schema } from "mongoose";

const alumniSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    // NOT required on creation — alumni fills these in profile setup
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    currentRole: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      min: 0,
      max: 50,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    sessionRate: {
      type: Number,
      min: 0,
      default: 0,
    },

    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" },

    education: {
      degree: { type: String, default: "" },
      college: { type: String, default: "" },
      year: { type: Number, default: null },
    },

    // Structured availability: [{ day: "Monday", slots: ["10:00", "14:00"] }]
    availability: [
      {
        day: String,
        slots: [String],
      },
    ],

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