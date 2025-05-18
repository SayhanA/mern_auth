import AppError from "../utlis/AppError.js";
import { catchAsyncError } from "../middlewars/catchAsyncError.js";
import { validationResult } from "express-validator";
import { User } from "../models/user.js";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../node_mailer/email.js";
import { sendVerificationTokenByCall } from "../twilio/twilio.js";
import dotenv from "dotenv";
import { sendToken } from "../utlis/sendToken.js";
import crypto from "crypto";

dotenv.config();

export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, phone, password, verificationMethod } = req.body;

    const isValidate = validationResult(req);
    if (!isValidate.isEmpty()) {
      return next(new AppError(isValidate.array()[0]?.msg, 400));
    }

    const conditions = [];

    if (verificationMethod === "email") {
      conditions.push({ $and: [{ email }, { isVerified: true }] });
    }
    if (verificationMethod === "phone") {
      conditions.push({ $and: [{ phone }, { isVerified: true }] });
    }

    const existionUser = await User.findOne({
      $or: conditions,
    });

    console.log({ existionUser });

    if (existionUser) {
      return next(new AppError("User is already exist!", 400));
    }

    const registrationAttemptsByUser = await User.find({
      $or: [
        { email, isVerified: false },
        { phone, isVerified: false },
      ],
    });

    if (registrationAttemptsByUser.length > 3) {
      return next(
        new AppError(
          "You have exceeded the maximum number of attempt(3). Please try again after an hour.",
          400
        )
      );
    }

    const userData = { name, email, phone, password };
    const user = await User.create(userData);

    const verificationToken = user.generateVerificationToken();
    let response;
    try {
      response = await user.save();
      // console.log("🚀 ~ register ~ response:", response);
    } catch (err) {
      console.error("❌ Error saving user:", err);
      return next(err);
    }
    sendVerificationCode(
      verificationMethod,
      verificationToken,
      email,
      phone,
      user
    );

    res.status(201).json({
      success: true,
      message:
        "User created successfully please check your email or phone to verify",
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

async function sendVerificationCode(
  verificationMethod,
  verificationToken,
  email,
  phone,
  user
) {
  let subject = "Your verification code";
  let username = user.name;

  if (verificationMethod === "email") {
    sendVerificationEmail(email, subject, username, verificationToken);
  } else if (verificationMethod === "phone") {
    sendVerificationTokenByCall(verificationToken, phone);
  } else {
    throw new AppError("Invalid verification method", 500);
  }
}

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, opt, phone } = req.body;

  try {
    const userAllData = await User.find({
      $or: [
        { email, isVerified: false },
        { phone, isVerified: false },
      ],
    });

    const userAllEntries = userAllData.reverse();

    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new AppError("User not found", 404));
    }

    const user = userAllEntries[0];

    if (Number(user.verificationToken) !== Number(opt)) {
      return next(new AppError("Invalid OTP", 400));
    }

    const currentTime = new Date();
    const verificationTokenExpire = user.verificationTokenExpiredAt;

    if (currentTime > verificationTokenExpire) {
      return next(new AppError("OTP expired", 400));
    }

    await User.deleteMany({
      _id: { $ne: user._id },
      $or: [
        { email, isVerified: false },
        { phone, isVerified: false },
      ],
    });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiredAt = undefined;
    await user.save({ validateModifiedOnly: true });

    return sendToken(user, 200, "User verified successfully", res);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isVerified: true }).select(
    "+password"
  );
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new AppError("Invalid email or password", 401));
  }

  return sendToken(user, 200, "User logged in successfully", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email, isVerified: true });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = await user.generateResetPasswordToken();
  console.log({ resetToken });
  await user.save({ validateModifiedOnly: true });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/reset_password/${resetToken}`;

  try {
    sendResetPasswordEmail(
      user.email,
      "Password Recovery",
      user.name,
      resetUrl
    );

    res.status(200).json({
      success: true,
      message: `Reset password link sent to ${user.email}`,
      resetToken,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiredAt = undefined;
    await user.save({ validateModifiedOnly: true });
    return next(new AppError(error.message, 500));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiredAt: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired token", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiredAt = undefined;
  await user.save({ validateModifiedOnly: true });
  return sendToken(user, 200, "Password reset successfully", res);
});
