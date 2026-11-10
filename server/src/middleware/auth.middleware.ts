import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth.util.js";

declare global {
  namespace Express {
    interface Request {
      user?: Awaited<ReturnType<typeof verifyAccessToken>>;
    }
  }
}

async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // get token from header
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    // verify token
    const decoded = await verifyAccessToken({ token });

    // save decoded user in request
    req.user = decoded;

    next();
  } catch (error) {
    // send error response
    return res.status(401).json({
      message: "Invalid access token",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export default authMiddleware;