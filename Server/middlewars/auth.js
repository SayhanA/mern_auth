import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import AppError from "../utlis/AppError.js";
import { catchAsyncError } from "./catchAsyncError.js";

dotenv.config();

export const isAuthenticated = catchAsyncError((req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError("Please login to access this resource", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
    if (err) {
        return next(new AppError("Invalid token", 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    req.user = user;
    next();
  });
});
