import dotenv from "dotenv";
dotenv.config();

export const sendToken = async (user, statusCode, message, res) => {
  const token = await user.generateToken();

  return res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .json({
      success: true,
      message,
      token,
      user
    });
};
