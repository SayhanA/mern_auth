import express from "express";
import { register } from "../controllers/user.js";
import { registerValidationRules } from "../validators/user.js";

const router = express.Router();

// POST:  /api/v1/user/register
router.post("/register", registerValidationRules, register);

export default router;
