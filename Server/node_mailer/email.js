import { verificationEmailTemplate } from "./email_template.js";
import "dotenv/config";
import transporter from "./node_mailer.config.js";

export const sendVerificationEmail = async (
  email,
  subject,
  username,
  verificationToken
) => {
  const options = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html: verificationEmailTemplate(username, verificationToken),
  };

  return await transporter.sendMail(options);
};

export const sendResetPasswordEmail = async (
  email,
  subject,
  username,
  resetLink
) => {
  const option = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html: resetPasswordTemplate(username, resetLink),
  };
};
