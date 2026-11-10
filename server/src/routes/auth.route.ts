import { Router } from "express";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/auth.validator.js";
import {
  userLoginController,
  userRegisterController,
} from "../controllers/auth.controller.js";

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

export default router;
