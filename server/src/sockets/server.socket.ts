import { Server, type Socket } from "socket.io";
import { verifyAccessToken } from "../utils/JWT.js";
import config from "../config/config.js";

// Extend Socket type to carry the authenticated user
declare module "socket.io" {
  interface Socket {
    user?: Awaited<ReturnType<typeof verifyAccessToken>>;
  }
}

export default function initializeSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = await verifyAccessToken({ token });
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("User connected : ", socket.id);

    socket.on("message", (msg) => {
      socket.broadcast.emit("message", { ...msg });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
}
