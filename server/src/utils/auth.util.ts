import type { Types } from "mongoose";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

// Define cookie options for storing the refresh token
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

async function verifyAccessToken({token}: {token: string}): Promise<{userId: Types.ObjectId | string}> {
  const secret = config.accessTokenSecret;
  if(secret === undefined) {
    throw new Error("Access token secret is not configured");
  }
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
    return { userId: decoded.userId };
  } else {
    throw new Error("Invalid access token");
  }
}

async function verifyRefreshToken({token}: {token: string}): Promise<{userId: Types.ObjectId | string}> {
  const secret = config.refreshTokenSecret;
  if(secret === undefined) {
    throw new Error("Refresh token secret is not configured");
  }
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
    return { userId: decoded.userId };
  } else {
    throw new Error("Invalid refresh token");
  }
}

export { COOKIE_OPTIONS, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
