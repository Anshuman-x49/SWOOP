import { body, param, query } from "express-validator";
import { validationMiddleware } from "../middleware/validation.middleware.js";

export const createConversationValidator = [
  body("participantId")
    .exists()
    .withMessage("participantId is required")
    .bail()
    .isMongoId()
    .withMessage("participantId must be a valid MongoDB ObjectId"),
  validationMiddleware,
];

export const getMessagesValidator = [
  param("id")
    .exists()
    .withMessage("Conversation ID is required")
    .bail()
    .isMongoId()
    .withMessage("Conversation ID must be a valid MongoDB ObjectId"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  validationMiddleware,
];

export const sendMessageValidator = [
  param("id")
    .exists()
    .withMessage("Conversation ID is required")
    .bail()
    .isMongoId()
    .withMessage("Conversation ID must be a valid MongoDB ObjectId"),
  body("content")
    .exists()
    .withMessage("Message content is required")
    .bail()
    .isString()
    .withMessage("Message content must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Message content cannot be empty")
    .bail()
    .isLength({ max: 2000 })
    .withMessage("Message content cannot exceed 2000 characters"),
  validationMiddleware,
];
