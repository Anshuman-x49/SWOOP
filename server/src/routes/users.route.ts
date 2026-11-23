import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { searchUsersController } from "../controllers/users.controller.js";

const router = Router();

// User search requires authentication
router.use(authMiddleware);

/**
 * @route GET /api/users/search
 * @desc Search users by name or email
 */
router.get("/search", searchUsersController);

export default router;
