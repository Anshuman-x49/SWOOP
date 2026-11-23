import { Server, type Socket } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { verifyAccessToken } from "../utils/JWT.js";
import config from "../config/config.js";
import { createMessage, updateMessageStatus, markConversationMessagesAsRead } from "../DAO/message.dao.js";
import { updateConversationLastMessage, getConversationById } from "../DAO/conversation.dao.js";

// Extend Socket type to carry the authenticated user
declare module "socket.io" {
  interface Socket {
    user?: Awaited<ReturnType<typeof verifyAccessToken>>;
  }
}

let ioInstance: Server | null = null;

/**
 * Accessor to get the active Socket.IO server instance
 */
export function getIO(): Server | null {
  return ioInstance;
}

export default function initializeSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
  });

  ioInstance = io;

  // Map: userId (string) -> Set of active socket IDs for multi-tab support
  const onlineUsers = new Map<string, Set<string>>();

  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    // Check header or handshake auth token
    const token =
      socket.handshake.headers?.authorization?.split(" ")[1] ||
      (socket.handshake.auth?.token as string | undefined);

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = await verifyAccessToken({ token });
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.user?.userId?.toString();

    if (!userId) {
      socket.disconnect(true);
      return;
    }

    // 1. Presence tracking: Add socket id to user's set
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
      // First connection for this user -> broadcast online presence
      io.emit("user-online", { userId });
    }
    onlineUsers.get(userId)!.add(socket.id);

    // Send the current list of online users to the newly connected socket
    const currentlyOnline = Array.from(onlineUsers.keys());
    socket.emit("online-users", { userIds: currentlyOnline });

    // 2. Join a conversation room
    socket.on("join-conversation", ({ conversationId }: { conversationId: string }) => {
      if (conversationId) {
        socket.join(conversationId);
      }
    });

    // 3. Leave a conversation room
    socket.on("leave-conversation", ({ conversationId }: { conversationId: string }) => {
      if (conversationId) {
        socket.leave(conversationId);
      }
    });

    // 4. Send real-time message via socket
    socket.on(
      "send-message",
      async (data: { conversationId: string; content: string }) => {
        try {
          const { conversationId, content } = data;
          if (!conversationId || !content?.trim()) return;

          // Verify conversation exists and user is participant
          const conversation = await getConversationById({ conversationId });
          if (!conversation) return;

          const isParticipant = conversation.participants.some(
            (p: any) => p._id.toString() === userId || p.toString() === userId
          );
          if (!isParticipant) return;

          // Persist message to database
          const message = await createMessage({
            conversationId,
            senderId: userId,
            content: content.trim(),
          });

          // Update conversation's lastMessage reference
          await updateConversationLastMessage({
            conversationId,
            messageId: message._id,
          });

          // Broadcast to everyone in the conversation room (including sender)
          io.to(conversationId).emit("new-message", message);
        } catch (error) {
          console.error("Socket send-message error:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    // 5. Typing indicator events
    socket.on("typing-start", ({ conversationId }: { conversationId: string }) => {
      if (conversationId) {
        socket.to(conversationId).emit("typing", {
          conversationId,
          userId,
          isTyping: true,
        });
      }
    });

    socket.on("typing-stop", ({ conversationId }: { conversationId: string }) => {
      if (conversationId) {
        socket.to(conversationId).emit("typing", {
          conversationId,
          userId,
          isTyping: false,
        });
      }
    });

    // 6. Mark message as read
    socket.on(
      "mark-read",
      async ({
        conversationId,
        messageId,
      }: {
        conversationId: string;
        messageId?: string;
      }) => {
        try {
          if (messageId) {
            await updateMessageStatus({ messageId, status: "read" });
          } else if (conversationId) {
            await markConversationMessagesAsRead({
              conversationId,
              readerId: userId,
            });
          }

          io.to(conversationId).emit("message-read", {
            conversationId,
            messageId,
            userId,
          });
        } catch (error) {
          console.error("Socket mark-read error:", error);
        }
      }
    );

    // 7. Handle disconnect
    socket.on("disconnect", () => {
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          // Last tab disconnected -> broadcast offline presence
          io.emit("user-offline", { userId });
        }
      }
    });
  });

  return io;
}
