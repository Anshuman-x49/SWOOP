import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { AppError } from "../utils/AppError.js";
import config from "../config/config.js";

const app: Application = express();
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true, limit: "15kb" }));
app.use(cookieParser());

// Routes import
import authRoutes from "../routes/auth.route.js";
import conversationRoutes from "../routes/conversation.route.js";
import usersRoutes from "../routes/users.route.js";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/users", usersRoutes);

// Centralized error handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
    });
  }

  // Handle Mongoose CastError (invalid ObjectId format)
  if (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    err.name === "CastError"
  ) {
    return res.status(400).json({
      message: "Invalid resource identifier format",
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    message: "Internal server error",
  });
});

export default app;
