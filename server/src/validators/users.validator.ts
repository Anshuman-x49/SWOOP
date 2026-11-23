import { query } from "express-validator";
import { validationMiddleware } from "../middleware/validation.middleware.js";

export const searchUsersValidator = [
  query("q")
    .optional()
    .isString()
    .withMessage("Search query must be a string")
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Search query cannot exceed 50 characters"),
  validationMiddleware,
];
