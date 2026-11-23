import mongoose, { type Types } from "mongoose";

interface IConversation extends mongoose.Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for fast lookup of conversations by participant
conversationSchema.index({ participants: 1 });

const conversationModel = mongoose.model<IConversation>(
  "conversation",
  conversationSchema
);

export { conversationModel };
export type { IConversation };
