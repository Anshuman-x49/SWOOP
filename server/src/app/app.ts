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

const app: Application = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes import
import authRoutes from "../routes/auth.route.js";

// Use routes
app.use("/api/auth", authRoutes);

// Centralized error handling middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    message: "Internal server error",
    error: err instanceof Error ? err.message : String(err),
  });
});

export default app;
