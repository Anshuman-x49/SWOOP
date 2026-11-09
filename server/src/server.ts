import app from "./app/app.js";
import { createServer } from "node:http";
import initializeSocket from "./sockets/server.socket.js";
import config from "./config/config.js";
import connectDB from "./config/db.js";

const httpServer = createServer(app);
initializeSocket(httpServer);

await connectDB();

httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
