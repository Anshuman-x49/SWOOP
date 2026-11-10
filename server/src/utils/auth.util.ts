import type { Types } from "mongoose";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Generate JWT access token
async function generateAccessToken({
  userId,
}: {
  userId: Types.ObjectId | string;
}): Promise<string> {
  const secret = config.accessTokenSecret;
  if (secret === undefined) {
    throw new Error("Access token secret is not configured");
  }
  return jwt.sign({ userId }, secret, { expiresIn: "15m" });
}

// Generate JWT refresh token
async function generateRefreshToken({
  userId,
}: {
  userId: Types.ObjectId | string;
}): Promise<string> {
  const secret = config.refreshTokenSecret;
  if (secret === undefined) {
    throw new Error("Refresh token secret is not configured");
  }
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

export { COOKIE_OPTIONS, generateAccessToken, generateRefreshToken };
