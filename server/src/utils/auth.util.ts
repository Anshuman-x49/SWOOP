import config from "../config/config.js";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Generate JWT access token
async function generateAccessToken(payload: object): Promise<string> {
  const secret = config.accessTokenSecret;
  if (secret === undefined) {
    throw new Error("Access token secret is not configured");
  }
  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

// Generate JWT refresh token
async function generateRefreshToken(payload: object): Promise<string> {
  const secret = config.refreshTokenSecret;
  if (secret === undefined) {
    throw new Error("Refresh token secret is not configured");
  }
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export { COOKIE_OPTIONS, generateAccessToken, generateRefreshToken };
