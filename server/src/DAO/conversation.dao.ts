import type { Types } from "mongoose";
import { conversationModel, type IConversation } from "../models/conversation.model.js";

interface FindOrCreateConversationOptions {
  user1Id: Types.ObjectId | string;
  user2Id: Types.ObjectId | string;
}

/**
 * Finds an existing 1-on-1 direct conversation between two users or creates a new one
 */
async function findOrCreateDirectConversation({
  user1Id,
  user2Id,
}: FindOrCreateConversationOptions): Promise<IConversation> {
  // Find conversation where both users are participants and exactly 2 participants
  const existing = await conversationModel
    .findOne({
      participants: { $all: [user1Id, user2Id], $size: 2 },
    })
    .populate("participants", "name email")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name email" },
    })
    .exec();

  if (existing) {
    return existing;
  }

  const created = await conversationModel.create({
    participants: [user1Id, user2Id],
    lastMessage: null,
  });

  return await created.populate("participants", "name email");
}

/**
 * Retrieves all conversations for a specific user, sorted by most recently updated
 */
async function getConversationsByUserId({
  userId,
}: {
  userId: Types.ObjectId | string;
}): Promise<IConversation[]> {
  return await conversationModel
    .find({ participants: userId })
    .populate("participants", "name email")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name email" },
    })
    .sort({ updatedAt: -1 })
    .exec();
}

/**
 * Retrieves a single conversation by ID with populated participants and lastMessage
 */
async function getConversationById({
  conversationId,
}: {
  conversationId: Types.ObjectId | string;
}): Promise<IConversation | null> {
  return await conversationModel
    .findById(conversationId)
    .populate("participants", "name email")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name email" },
    })
    .exec();
}

/**
 * Updates the lastMessage reference in a conversation
 */
async function updateConversationLastMessage({
  conversationId,
  messageId,
}: {
  conversationId: Types.ObjectId | string;
  messageId: Types.ObjectId | string;
}): Promise<IConversation | null> {
  return await conversationModel
    .findByIdAndUpdate(
      conversationId,
      { lastMessage: messageId },
      { returnDocument: "after" }
    )
    .exec();
}

export {
  findOrCreateDirectConversation,
  getConversationsByUserId,
  getConversationById,
  updateConversationLastMessage,
};
