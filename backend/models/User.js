import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [2, "Name must be at least 2 letters"],
      maxlength: [50, "Name should be maximum of 50 letters"],
      required:true
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required:true
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
      required:true
    },

    role: {
      type: String,
      enum: ["student", "alumni", "admin"],
      default: "student",
      required:true
    },

    profilePhoto: String,
    cloudinaryId: String,
    college: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);