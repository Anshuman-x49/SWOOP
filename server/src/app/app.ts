import express, { type Application } from "express";
import helmet from "helmet";
import cors from "cors";

const app: Application = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes import
import authRoutes from "../routes/auth.route.js";

// Use routes
app.use("/api/auth", authRoutes);

export default app;
