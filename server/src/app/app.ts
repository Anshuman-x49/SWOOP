import express, { type Application } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

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

export default app;
