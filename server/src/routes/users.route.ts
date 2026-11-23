import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { searchUsersController } from "../controllers/users.controller.js";
import { searchUsersValidator } from "../validators/users.validator.js";

const router = Router();

// User search requires authentication
router.use(authMiddleware);

/**
 * @route GET /api/users/search
 * @desc Search users by name or email
 */
router.get("/search", searchUsersValidator, searchUsersController);

export default router;
