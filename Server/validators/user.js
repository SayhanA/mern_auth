import { body } from "express-validator";

export const registerValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Name must have at list five characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .trim(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be 6-12 characters long")
    .trim(),

  body("phone")
    .isMobilePhone("bn-BD")
    .optional({ checkFalsy: true })
    .withMessage("Invalid Bangladeshi mobile number")
    .custom((value) => {
      const phoneRegex = /^\+880\d{9}$/;
      if (!phoneRegex.test(value)) {
        throw new Error("Phone number must be in +880XXXXXXXXX format");
      }
      return true;
    }),
];
