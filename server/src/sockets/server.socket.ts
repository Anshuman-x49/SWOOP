import { Server } from "socket.io";

export default function initializeSocket(httpServer: any) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("message", (msg) => {
      socket.broadcast.emit("message", { ...msg });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
