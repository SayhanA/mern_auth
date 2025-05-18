import express from "express";
import {
  forgotPassword,
  getUser,
  login,
  logout,
  register,
  resetPassword,
  verifyOTP,
} from "../controllers/user.js";
import { registerValidationRules } from "../validators/user.js";
import { isAuthenticated } from "../middlewars/auth.js";

const router = express.Router();

// POST:  /api/v1/user/register
router.post("/register", registerValidationRules, register);

// POST:  /api/v1/user/verify
router.post("/verify_otp", verifyOTP);

// POST:  /api/v1/user/login
router.post("/login", login);

// POST:  /api/v1/user/logout
router.get("/logout", isAuthenticated, logout);

// GET:  /api/v1/user/profile
router.get("/profile", isAuthenticated, getUser);

// POST:  /api/v1/user/forgot_password
router.post("/forgot_password", forgotPassword);

// POST:  /api/v1/user/reset_password/:token
router.post("/reset_password/:token", resetPassword);

export default router;
