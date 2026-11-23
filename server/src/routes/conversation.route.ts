import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getConversationsController,
  createOrGetConversationController,
  getMessagesController,
  sendMessageController,
} from "../controllers/conversation.controller.js";

const router = Router();

// All conversation routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/conversations
 * @desc List all conversations for authenticated user
 */
router.get("/", getConversationsController);

/**
 * @route POST /api/conversations
 * @desc Create or retrieve direct conversation with participant
 */
router.post("/", createOrGetConversationController);

/**
 * @route GET /api/conversations/:id/messages
 * @desc Get paginated messages for a conversation
 */
router.get("/:id/messages", getMessagesController);

/**
 * @route POST /api/conversations/:id/messages
 * @desc Send a new message to a conversation
 */
router.post("/:id/messages", sendMessageController);

export default router;
