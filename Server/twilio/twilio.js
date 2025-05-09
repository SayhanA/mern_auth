import AppError from "../utlis/AppError.js";
import client from "./twilio.config.js";
import "dotenv/config";

export const sendVerificationTokenByCall = async (verificationToken, phone) => {
  try {
    const verificationTokenWithSpace = verificationToken
      .toString()
      .split("")
      .join(" ");

    const call = await client.call.create({
      twiml: `<Response><Say>Your verification code is ${verificationTokenWithSpace}</Say></Response>`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    console.log("✅ Call initiated:", call.sid);
    return call;
  } catch (error) {
    throw new AppError(
      `❌ Error sending verification call: ${error.message}`,
      500
    );
  }
};
