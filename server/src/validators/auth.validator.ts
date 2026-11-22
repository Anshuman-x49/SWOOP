import { body, cookie } from "express-validator";
import { validationMiddleware } from "../middleware/validation.middleware.js";

// User registration validation middleware
const userRegisterValidator = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validationMiddleware,
];

// User login validation middleware
const userLoginValidator = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validationMiddleware,
];

// User logout validation middleware
const userLogoutValidator = [
  cookie("refreshToken")
    .exists()
    .withMessage("Refresh token is required")
    .bail()
    .isJWT()
    .withMessage("Refresh token is invalid"),

  validationMiddleware,
];

// User refresh token validation middleware
const userRefreshTokenValidator = [
  cookie("refreshToken")
    .exists()
    .withMessage("Refresh token is required")
    .bail()
    .isJWT()
    .withMessage("Refresh token is invalid"),

  validationMiddleware,
];

export {
  userRegisterValidator,
  userLoginValidator,
  userLogoutValidator,
  userRefreshTokenValidator,
};
