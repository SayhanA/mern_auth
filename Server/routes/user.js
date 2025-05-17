import express from "express";
import { register, verifyOTP } from "../controllers/user.js";
import { registerValidationRules } from "../validators/user.js";

const router = express.Router();

// POST:  /api/v1/user/register
router.post("/register", registerValidationRules, register);

// POST:  /api/v1/user/verify
router.post("/verify_otp", verifyOTP);

export default router;
