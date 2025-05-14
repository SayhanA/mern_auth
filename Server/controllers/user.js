import AppError from "../utlis/AppError.js";
import { catchAsyncError } from "../middlewars/catchAsyncError.js";
import { validationResult } from "express-validator";
import { User } from "../models/user.js";
import { sendVerificationEmail } from "../node_mailer/email.js";
import { sendVerificationTokenByCall } from "../twilio/twilio.js";
import dotenv from "dotenv";

dotenv.config();

export const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, phone, password, verificationMethod } = req.body;

    const isValidate = validationResult(req);
    if (!isValidate.isEmpty()) {
      return next(new AppError(isValidate.array()[0]?.msg, 400));
    }

    const existionUser = await User.findOne({
      $or: [
        {
          email,
          isVerified: true,
        },
        {
          phone,
          isVerified: true,
        },
      ],
    });

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
      console.log("🚀 ~ register ~ response:", response);
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
  user,
) {
  let subject = "Your verification code";
  let username = user.name;

  if (verificationMethod === "email") {
    sendVerificationEmail(
      email,
      subject,
      username,
      verificationToken
    );
  } else if (verificationMethod === "phone") {
    sendVerificationTokenByCall(verificationToken, phone);
  } else {
    throw new AppError("Invalid verification method", 500);
  }
}
