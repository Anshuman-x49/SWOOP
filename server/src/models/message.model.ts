import mongoose, { type Types } from "mongoose";

type MessageStatus = "sent" | "delivered" | "read";

interface IMessage extends mongoose.Document {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

// Compound index for paginated message retrieval ordered by createdAt
messageSchema.index({ conversation: 1, createdAt: -1 });

const messageModel = mongoose.model<IMessage>("message", messageSchema);

export { messageModel };
export type { IMessage, MessageStatus };
