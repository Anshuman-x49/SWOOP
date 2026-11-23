import type { Types } from "mongoose";
import { messageModel, type IMessage, type MessageStatus } from "../models/message.model.js";

interface CreateMessageData {
  conversationId: Types.ObjectId | string;
  senderId: Types.ObjectId | string;
  content: string;
}

interface GetMessagesOptions {
  conversationId: Types.ObjectId | string;
  page?: number;
  limit?: number;
}

/**
 * Creates and saves a new message
 */
async function createMessage({
  conversationId,
  senderId,
  content,
}: CreateMessageData): Promise<IMessage> {
  const message = await messageModel.create({
    conversation: conversationId,
    sender: senderId,
    content,
    status: "sent",
  });

  return await message.populate("sender", "name email");
}

/**
 * Retrieves paginated messages for a conversation, sorted by newest first
 */
async function getMessagesByConversationId({
  conversationId,
  page = 1,
  limit = 30,
}: GetMessagesOptions): Promise<{ messages: IMessage[]; total: number; hasMore: boolean }> {
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    messageModel
      .find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name email")
      .exec(),
    messageModel.countDocuments({ conversation: conversationId }),
  ]);

  const hasMore = skip + messages.length < total;

  return {
    messages,
    total,
    hasMore,
  };
}

/**
 * Updates the delivery/read status of a message
 */
async function updateMessageStatus({
  messageId,
  status,
}: {
  messageId: Types.ObjectId | string;
  status: MessageStatus;
}): Promise<IMessage | null> {
  return await messageModel
    .findByIdAndUpdate(
      messageId,
      { status },
      { returnDocument: "after" }
    )
    .populate("sender", "name email")
    .exec();
}

/**
 * Marks all unread messages in a conversation as read by a specific reader
 */
async function markConversationMessagesAsRead({
  conversationId,
  readerId,
}: {
  conversationId: Types.ObjectId | string;
  readerId: Types.ObjectId | string;
}): Promise<number> {
  const result = await messageModel.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: readerId },
      status: { $ne: "read" },
    },
    { status: "read" }
  );

  return result.modifiedCount;
}

export {
  createMessage,
  getMessagesByConversationId,
  updateMessageStatus,
  markConversationMessagesAsRead,
};
