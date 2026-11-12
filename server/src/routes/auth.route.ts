import { Router } from "express";
import {
  userLoginValidator,
  userLogoutValidator,
  userRegisterValidator,
} from "../validators/auth.validator.js";
import {
  userLoginController,
  userLogoutController,
  userRefreshTokenController,
  userRegisterController,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", userRegisterValidator, userRegisterController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", userLoginValidator, userLoginController);

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token using refresh token
 * @access Public
 */
router.post("/refresh-token", userRefreshTokenController);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Private
 */
router.post(
  "/logout",
  authMiddleware,
  userLogoutValidator,
  userLogoutController,
);

export default router;
