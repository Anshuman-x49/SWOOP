import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  findOrCreateDirectConversation,
  getConversationsByUserId,
  getConversationById,
  updateConversationLastMessage,
} from "../DAO/conversation.dao.js";
import {
  createMessage,
  getMessagesByConversationId,
  markConversationMessagesAsRead,
} from "../DAO/message.dao.js";
import { getUserById } from "../DAO/user.dao.js";
import { getIO } from "../sockets/server.socket.js";

/**
 * GET /api/conversations
 * List all conversations for the authenticated user
 */
export async function getConversationsController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const conversations = await getConversationsByUserId({ userId });

  return sendSuccess({
    res,
    statusCode: 200,
    message: "Conversations retrieved successfully",
    data: { conversations },
  });
}

/**
 * POST /api/conversations
 * Create or get an existing 1-on-1 direct conversation with a participant
 */
export async function createOrGetConversationController(
  req: Request,
  res: Response
) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const { participantId } = req.body;
  if (!participantId) {
    throw new AppError(400, "participantId is required");
  }

  if (userId.toString() === participantId.toString()) {
    throw new AppError(400, "Cannot start a conversation with yourself");
  }

  // Ensure target user exists
  const targetUser = await getUserById({ userId: participantId });
  if (!targetUser) {
    throw new AppError(404, "Target user not found");
  }

  const conversation = await findOrCreateDirectConversation({
    user1Id: userId,
    user2Id: participantId,
  });

  return sendSuccess({
    res,
    statusCode: 200,
    message: "Conversation ready",
    data: { conversation },
  });
}

/**
 * GET /api/conversations/:id/messages
 * Retrieve paginated messages for a conversation
 */
export async function getMessagesController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const rawId = req.params.id;
  const conversationId = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!conversationId) {
    throw new AppError(400, "Conversation ID is required");
  }

  // Verify membership
  const conversation = await getConversationById({ conversationId });
  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const isMember = conversation.participants.some(
    (p: any) => p._id.toString() === userId.toString() || p.toString() === userId.toString()
  );
  if (!isMember) {
    throw new AppError(403, "Forbidden: You are not a participant in this conversation");
  }

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 30;

  const { messages, total, hasMore } = await getMessagesByConversationId({
    conversationId,
    page,
    limit,
  });

  // Mark unread messages in this conversation as read
  const modifiedCount = await markConversationMessagesAsRead({
    conversationId,
    readerId: userId,
  });

  // Emit real-time read acknowledgment if messages were marked read
  if (modifiedCount > 0) {
    const io = getIO();
    if (io) {
      io.to(conversationId).emit("message-read", {
        conversationId,
        userId,
      });
    }
  }

  return sendSuccess({
    res,
    statusCode: 200,
    message: "Messages retrieved successfully",
    data: {
      messages,
      total,
      hasMore,
      page,
      limit,
    },
  });
}

/**
 * POST /api/conversations/:id/messages
 * Send a message via REST, persist to DB, and broadcast via Socket.IO
 */
export async function sendMessageController(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const rawId = req.params.id;
  const conversationId = Array.isArray(rawId) ? rawId[0] : rawId;
  const { content } = req.body;

  if (!conversationId) {
    throw new AppError(400, "Conversation ID is required");
  }

  if (!content || !content.trim()) {
    throw new AppError(400, "Message content is required");
  }

  // Verify membership
  const conversation = await getConversationById({ conversationId });
  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const isMember = conversation.participants.some(
    (p: any) => p._id.toString() === userId.toString() || p.toString() === userId.toString()
  );
  if (!isMember) {
    throw new AppError(403, "Forbidden: You are not a participant in this conversation");
  }

  // Create message
  const message = await createMessage({
    conversationId,
    senderId: userId,
    content: content.trim(),
  });

  // Update conversation lastMessage
  await updateConversationLastMessage({
    conversationId,
    messageId: message._id,
  });

  // Emit real-time socket event to the room
  const io = getIO();
  if (io) {
    io.to(conversationId).emit("new-message", message);
  }

  return sendSuccess({
    res,
    statusCode: 201,
    message: "Message sent successfully",
    data: { message },
  });
}
