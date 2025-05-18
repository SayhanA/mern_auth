import express from "express";
import { login, logout, register, verifyOTP } from "../controllers/user.js";
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

export default router;
