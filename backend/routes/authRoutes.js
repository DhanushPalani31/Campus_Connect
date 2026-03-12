import express from "express";
import {
  register,
  login,
  logout,
  getMe,

} from "../controllers/authController.js";
import { protectRoute } from "../middleware/authmiddleware.js";



const authRoutes = express.Router();

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", protectRoute, logout);

authRoutes.get("/me", protectRoute, getMe);



export default authRoutes;